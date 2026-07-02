import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalCrearComponent } from './modal-crear/modal-crear.component';
import { BotonNotificacionComponent } from "../../boton-notificacion/boton-notificacion.component";
import { ContactoEntidad } from '../../../../models/contactoEntidad.mode';
import { GenericService } from '../../../../services/generic.services';
import { CompartirDatosService } from '../../../../services/compartir-datos.service';
import { Entidad } from '../../../../models/entidad.model';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { BadgeModule } from 'primeng/badge';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

interface EntidadTerritorialRow {
  id: string;
  entidadId: string;
  entidadNombre: string;
  tipoIdentificacion: string;
  numeroIdentificacion: string;
  representanteLegal: string;
  numeroContacto: string;
  correoElectronico: string;
  departamento: string;
  municipio: string;
  estado: string;
  dateCreated?: string;
  dateUpdated?: string;
  dateDeleted?: string;
  createdByUserId?: string;
  updatedByUserId?: string;
  deletedByUserId?: string;
  raw: ContactoEntidad;
}

@Component({
  selector: 'app-contacto-entidad',
  standalone: true,
  imports: [ModalCrearComponent, CommonModule, FormsModule, TableModule, BotonNotificacionComponent, CardModule, DialogModule, BadgeModule],
  templateUrl: './contacto-entidad.component.html',
  styleUrl: './contacto-entidad.component.css'
})
export class ContactoEntidadComponent implements OnInit {
  @ViewChild(ModalCrearComponent) modalCrearComponent!: ModalCrearComponent;

  data: EntidadTerritorialRow[] = [];
  originalData: EntidadTerritorialRow[] = [];
  listaEntidades: Entidad[] = [];

  selectedItem: any = null;
  isEditing: boolean = false;

  filtroBuscar: string = '';
  filtroEntidad: string = '';

  first = 0;
  rows = 10;
  // BUG-LZ-019: array literal en template recreaba referencia y truncaba opciones del dropdown
  rowsPerPageOptions: number[] = [5, 10, 25, 50];

  historicoDialogVisible = false;
  historicoSeleccionado: EntidadTerritorialRow | null = null;
  // BUG-LZ-027: lista real de transacciones del contacto (no solo dateCreated/Updated/Deleted)
  historicosDetalle: any[] = [];
  historicosLoading = false;
  // BUG-LZ-027: traducir nombres de campo del JSON ObtenerCamposModificados a etiquetas en español
  private readonly camposEs: Record<string, string> = {
    'IsDeleted': 'Eliminado',
    'Activo': 'Activo',
    'Estado': 'Estado',
    'Nombres': 'Nombres',
    'Cargo': 'Cargo',
    'Email': 'Correo',
    'Telefonos': 'Teléfono',
    'EntidadId': 'Entidad',
    'DateUpdated': 'Fecha actualización',
    'UpdatedByUserId': 'Usuario actualizador'
  };

  constructor(private dataService: GenericService, private compartirDatosService: CompartirDatosService) { }

  ngOnInit(): void {
    // BUG-LZ-045 (extension): suscribirse PRIMERO al stream para no perder emit que llegue
    // antes que termine la carga inicial (race condition con Subject sin replay).
    this.compartirDatosService.nuevoContactoEAPB$.subscribe({
      next: () => {
        // BUG-LZ-045/061: en lugar de push payload (que puede llegar incompleto del backend
        // CreatedAtAction sin shape consistente), recargar lista completa para garantizar
        // que el nuevo contacto aparezca con todos los campos derivados (NIT, locacion).
        this.cargarDatos();
      }
    });

    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.dataService.get_withoutParameters('ET', 'TablaParametrica')
      .pipe(
        switchMap((entidades: any) => {
          this.listaEntidades = (entidades || []).sort((a: Entidad, b: Entidad) => a.nombre.localeCompare(b.nombre));
          return this.dataService.get_withoutParameters('ContactoEntidad', 'Entidad') as Observable<ContactoEntidad[]>;
        })
      )
      .subscribe({
        next: (contactos: ContactoEntidad[]) => {
          const todos = contactos || [];
          // BUG-LZ-045 (extension): ordenar por dateCreated desc para que un nuevo contacto
          // creado por modal aparezca en la primera fila al refrescar la lista.
          const ordenados = todos.slice().sort((a: any, b: any) => {
            const fa = a?.dateCreated ? new Date(a.dateCreated).getTime() : 0;
            const fb = b?.dateCreated ? new Date(b.dateCreated).getTime() : 0;
            return fb - fa;
          });
          this.originalData = ordenados.map(c => this.contactoToRow(c));
          this.compartirDatosService.actualizarListaContactos(ordenados);
          this.aplicarFiltros();
        },
        error: (e) => console.error('Error cargando entidades territoriales', e)
      });
  }

  private contactoToRow(c: any): EntidadTerritorialRow {
    const entidad = this.listaEntidades.find(e => String(e.codigo) === String(c.entidadId));
    const nit = entidad?.nit ? `${entidad.nit}${entidad.dv ? '-' + entidad.dv : ''}` : '';
    const locacion = this.parseLocacion(entidad?.descripcion || '');
    return {
      id: String(c.id ?? ''),
      entidadId: String(c.entidadId ?? ''),
      entidadNombre: entidad?.nombre || '',
      tipoIdentificacion: nit ? 'NIT' : '-',
      numeroIdentificacion: nit || '-',
      representanteLegal: [c.nombres, c.cargo].filter(Boolean).join(' - ') || '-',
      numeroContacto: c.telefonos || '-',
      correoElectronico: c.email || '-',
      departamento: locacion.departamento,
      municipio: locacion.municipio,
      estado: c.estado || (c.activo ? 'Activo' : 'Inactivo'),
      dateCreated: c.dateCreated,
      dateUpdated: c.dateUpdated,
      dateDeleted: c.dateDeleted,
      createdByUserId: c.createdByUserId,
      updatedByUserId: c.updatedByUserId,
      deletedByUserId: c.deletedByUserId,
      raw: c
    };
  }

  private parseLocacion(descripcion: string): { departamento: string; municipio: string } {
    if (!descripcion) return { departamento: '-', municipio: '-' };
    const partes = descripcion.split(/[,|\-]/).map(s => s.trim()).filter(Boolean);
    if (partes.length >= 2) return { departamento: partes[0], municipio: partes[1] };
    if (partes.length === 1) return { departamento: partes[0], municipio: '-' };
    return { departamento: '-', municipio: '-' };
  }

  get totalActivos(): number {
    return this.originalData.filter(r => (r.estado || '').toLowerCase() === 'activo').length;
  }

  get totalInactivos(): number {
    return this.originalData.filter(r => (r.estado || '').toLowerCase() === 'inactivo').length;
  }

  onEdit(row: EntidadTerritorialRow) {
    this.selectedItem = row.raw;
    this.isEditing = true;
    this.openModal();
  }

  onCreate() {
    this.selectedItem = null;
    this.isEditing = false;
    this.openModal();
  }

  openModal() {
    if (this.modalCrearComponent) this.modalCrearComponent.open();
  }

  onHistorico(row: EntidadTerritorialRow) {
    this.historicoSeleccionado = row;
    this.historicoDialogVisible = true;
    this.historicosDetalle = [];
    this.historicosLoading = true;

    this.dataService.get('ContactoEntidad/Historico/', row.id, 'Entidad').subscribe({
      next: (data: any) => {
        this.historicosDetalle = Array.isArray(data) ? data : [];
        this.historicosLoading = false;
      },
      error: (e) => {
        console.error('Error cargando histórico ContactoEntidad', e);
        this.historicosDetalle = [];
        this.historicosLoading = false;
      }
    });
  }

  cerrarHistorico() {
    this.historicoDialogVisible = false;
    this.historicoSeleccionado = null;
    this.historicosDetalle = [];
    this.historicosLoading = false;
  }

  // BUG-LZ-027: traducir comentario (campos modificados) y mostrar etiquetas legibles
  traducirComentario(historico: any): string {
    const comentario = historico?.comentario ?? '';
    if (!comentario) return '';
    return comentario.split(',').map((f: string) => {
      const k = f.trim();
      return this.camposEs[k] ?? k;
    }).join(', ');
  }

  // BUG-LZ-027: si comentario indica IsDeleted=true → mostrar transacción como Eliminar
  formatTransaccion(historico: any): string {
    const t = historico?.transaccion ?? '';
    if (t === 'Actualizacion' && (historico?.comentario || '').includes('IsDeleted')) {
      return 'Eliminar';
    }
    return t;
  }

  limpiar() {
    this.filtroEntidad = '';
    this.filtroBuscar = '';
    this.aplicarFiltros();
  }

  onFiltroBuscarChange(): void {
    this.aplicarFiltros();
  }

  onFiltroEntidadChange(): void {
    this.aplicarFiltros();
  }

  private aplicarFiltros(): void {
    let resultado = [...this.originalData];
    if (this.filtroEntidad) {
      resultado = resultado.filter(r => String(r.entidadId) === String(this.filtroEntidad));
    }
    if (this.filtroBuscar) {
      const term = this.filtroBuscar.toLowerCase();
      resultado = resultado.filter(r =>
        Object.values(r).some(v => typeof v === 'string' && v.toLowerCase().includes(term))
      );
    }
    this.data = resultado;
  }

  agregarNuevaEntidad(nuevaEAPB: any) {
    this.listaEntidades = [...this.listaEntidades, nuevaEAPB];
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }
}
