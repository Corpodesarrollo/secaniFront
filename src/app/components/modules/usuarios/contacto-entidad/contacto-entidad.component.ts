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
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-contacto-entidad',
  standalone: true,
  imports: [ModalCrearComponent, CommonModule, FormsModule, TableModule, BotonNotificacionComponent, CardModule],
  templateUrl: './contacto-entidad.component.html',
  styleUrl: './contacto-entidad.component.css'
})
export class ContactoEntidadComponent implements OnInit{
  @ViewChild(ModalCrearComponent) modalCrearComponent!: ModalCrearComponent;

  data: ContactoEntidad[] = [];

  originalData: any[] = [];

  listaEntidades: Entidad[] = [];

  selectedItem: any = null;
  isEditing: boolean = false;

  filtroBuscar: string = '';
  filtroEntidad: string = '';

  first = 0;
  rows = 10;

  constructor(private dataService: GenericService, private compartirDatosService: CompartirDatosService) { }

  ngOnInit(): void {
    this.dataService.get_withoutParameters('ET', 'TablaParametrica')
    .pipe(
      switchMap((entidades: any) => {
        this.listaEntidades = entidades;
        this.listaEntidades.sort((a, b) => a.nombre.localeCompare(b.nombre));
        console.log('Entidades ', this.listaEntidades);
        // Encadenar segunda petición
        return this.dataService.get_withoutParameters('ContactoEntidad', 'Entidad') as Observable<ContactoEntidad[]>;
      })
    )
    .subscribe({
      next: (contactos: ContactoEntidad[]) => {
        const idsValidos = new Set(this.listaEntidades.map(e => String(e.codigo)));
        const dataFiltrada = contactos.filter(contacto => idsValidos.has(String(contacto.entidadId)));
        this.data = dataFiltrada;
        this.originalData = dataFiltrada;
        this.compartirDatosService.actualizarListaContactos(this.originalData);
        console.log('Contactos: ', contactos);
      },
      error: (e) => console.error('Error en alguna de las llamadas', e),
      complete: () => console.info('Ambas listas se cargaron exitosamente')
    });

    this.compartirDatosService.nuevoContactoEAPB$.subscribe({
      next: (data: any) => {
        if (this.isEditing) {
          const index = this.data.findIndex(datanueva => datanueva.id === data.id);
          if (index !== -1) {
            this.data[index] = { ...this.data[index], ...data };
          }
        } else {
          this.data.push(data);
        }
        this.originalData = this.data;
        this.compartirDatosService.actualizarListaContactos(this.originalData);
        console.log('Array actualizado:', this.data);
      },
      error: (e) => console.error('Error al recibir el nuevo dato', e),
      complete: () => console.info('Actualización del array completada')
    });
  }

  /**Modal Crear y Editar**/

  onEdit(item: any) {
    this.selectedItem = item;
    this.isEditing = true; // Modo edición
    this.openModal();
  }

  onCreate() {
    this.selectedItem = null;
    this.isEditing = false; // Modo creación
    this.openModal();
  }

  openModal() {
    if (this.modalCrearComponent) {
      this.modalCrearComponent.open(); // Abre el modal
    }
  }

  /**Filtros**/

  limpiar() {
    this.filtroEntidad = "";
    this.filtroBuscar = "";
    this.data = [...this.originalData];
  }

  buscar(filtroBuscar: string, filtroEAPB: string) {
    this.data = [...this.originalData];

    if (filtroBuscar) {
      filtroBuscar = filtroBuscar.toLowerCase();
      this.data = this.data.filter(item =>
        Object.values(item).some(value => {
          if (typeof value === 'string') {
            return value.toString().toLowerCase().includes(filtroBuscar);
          }
          return false;
        })
      );
    }

    if (filtroEAPB) {
      this.data = this.data.filter(item => item.entidadNombre === filtroEAPB);
    }
  }

  buscarNombreEntidadPorId(id: number): string {
    const item = this.listaEntidades.find(eapb => eapb.codigo === id);
    return item ? item.nombre : 'No encontrado';
  }

  onFiltroBuscarChange(): void {
    //console.log('Buscar cambiado:', event);
    this.buscar(this.filtroBuscar, this.filtroEntidad); // Llama a la función de búsqueda
  }

  onFiltroEntidadChange(): void {
    //console.log('Orden cambiado:', event);
    this.buscar(this.filtroBuscar, this.filtroEntidad); // Llama a la función de búsqueda
  }

  agregarNuevaEntidad(nuevaEAPB: any) {
    this.listaEntidades.push(nuevaEAPB);
  }

  /**Paginador**/
  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  isLastPage(): boolean {
    return this.data ? this.first === this.data.length - this.rows : true;
  }

  isFirstPage(): boolean {
    return this.data ? this.first === 0 : true;
  }
}
