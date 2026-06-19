import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GenericService } from '../../../../services/generic.services';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { NNA } from '../../../../models/nna.model';
import { NNAInfoDiagnostico } from '../../../../models/nnaInfoDiagnostico.model';
import { SeguimientoCntFiltros } from '../../../../models/seguimientoCntFiltros.model';
import { Parametricas } from '../../../../models/parametricas.model';
import { SubcategoriaAlerta } from '../../../../models/subcategoriaAlerta.model';
import { TpParametros } from '../../../../core/services/tpParametros';
import { firstValueFrom, from, map, Observable } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { VerNotificacionComponent } from '../oficio-notificacion/ver-notificacion/ver-notificacion.component';
import { VerRespuestaComponent } from '../oficio-notificacion/ver-respuesta/ver-respuesta.component';
import { Alerta, NotificacionAlerta } from '../../../../models/ExportConsutarAlertas.model';
import { ToastModule } from 'primeng/toast';
import { ExcelExportService } from '../../../../services/excel-export.service';
import { CrearOficioComponent } from '../oficio-notificacion/crear-oficio/crear-oficio.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { apis } from '../../../../models/apis.model';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { PlantillasCorreoService } from '../../../../services/plantillas-correo.service';


@Component({
  selector: 'app-consultar-alertas',
  standalone: true,
  imports: [CommonModule, BadgeModule, CardModule, TableModule, RouterModule, ButtonModule, DividerModule, DialogModule, VerNotificacionComponent, VerRespuestaComponent, ToastModule, CrearOficioComponent,ConfirmDialogModule, DropdownModule, FormsModule
  ],
  templateUrl: './consultar-alertas.component.html',
  styleUrls: ['./consultar-alertas.component.css'],
  providers: [MessageService,ConfirmationService]
})
export class ConsultarAlertasComponent implements OnInit {
  descargar: boolean = false;
  idNna: string = "";
  idSeguimiento: string = "";
  seguimiento: any;
  datosNNAAux: any;
  datosNNA: NNA = new NNA();
  datosBasicosNNA: NNAInfoDiagnostico = {
    diagnostico: '',
    nombreCompleto: '',
    fechaNacimiento: '',
    idEstado: 0,
  };
  nombreDeptoOrigen: string = '';
  nombreDeptoActual: string = '';
  nombreMuniOrigen: string = '';
  nombreMuniActual: string = '';

  fechaInicio!: Date; // Fecha de nacimiento
  fechaFin: Date = new Date(); // Fecha actual
  tiempoTranscurrido: string = '';

  activeFilter: string = '0';
  cntFiltros: SeguimientoCntFiltros = {
    hoy: 0,
    conAlerta: 0,
    todos: 0,
    solicitadosPorCuidador: 0
  };

  todasAlertas: any[] = [];
  alertas: any[] = [];
  categoriasAlerta: any;
  subcategoriasAlerta: any;
  alertaSeleccionada!: any;

  notificacionesAlerta: any[] = [];

  listadoRegimenAfiliacion: any;
  regimenAfiliacion: any = '';

  listadoEAPB: any;

  expandedRowKeys: { [key: string]: boolean } = {};



  // BUG-024: selección plantilla oficio
  verDialogPlantilla: boolean = false;
  cargandoPlantillas: boolean = false;
  plantillasOficio: any[] = [];
  plantillaSeleccionada: any = null;

  constructor(
    private route: ActivatedRoute,
    private repos: GenericService,
    private tpp: TpParametros,
    private messageService: MessageService,
    private excelExportService: ExcelExportService,
    private confirmationService: ConfirmationService,
    private plantillasService: PlantillasCorreoService,
    private router: Router,
    private location: Location,
  ) { }

  // BUG-LZ-064 + BUG-LZ-078: VOLVER originalmente usaba location.back() pero eso permitia volver
  // al form "Guardar y gestionar alertas" + hacer click nuevamente -> duplicaba alertas en BD.
  // Ahora navegar siempre a la lista de seguimientos (forward navigation evita re-submit).
  volver(): void {
    this.router.navigate(['/gestion/seguimientos']);
  }

  ngOnInit() {
    // BUG-LZ-049: PrimeNG dialog/modal de la pantalla previa puede dejar `overflow:hidden` en
    // body al cerrarse, bloqueando scroll de esta pantalla hasta recargar (F5). Limpiar explícito.
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
      document.body.classList.remove('p-overflow-hidden');
    }
    this.route.paramMap.subscribe(params => {
      this.idSeguimiento = params.get('id') || '';
      this.loadSeguimientoData();
    });
  }

  loadSeguimientoData() {
    this.repos.get_withoutParameters(`Seguimiento/${this.idSeguimiento}`, 'Seguimiento').subscribe({
      next: (seguimientoData: any) => {
        this.seguimiento = seguimientoData;
        this.idNna = this.seguimiento.nnaId;
        this.loadNNAData();
        this.loadDatosBasicosNNA();
        this.loadSeguimientoAlertas();
      },
      error: (err: any) => console.error('Error al cargar seguimiento', err)
    });
  }

  loadNNAData() {
    this.repos.get_withoutParameters(`NNA/${this.idNna}`, 'NNA').subscribe({
      next: async (nnaData: any) => {
        this.datosNNA = nnaData;
        if (this.datosNNA.fechaNacimiento) {
          this.fechaInicio = new Date(this.datosNNA.fechaNacimiento);
        }
        this.calcularTiempoTranscurrido();

        // BUG-LZ-062: cuidadorTelefono en NNAs es NULL cuando el teléfono real esta en
        // ContactoNNAs (Cuidador=true). Resolver via ContactoNNAs si NULL para que el oficio
        // muestre el numero al notificar.
        if (!this.datosNNA.cuidadorTelefono) {
          this.repos.get_withoutParameters(`ContactoNNAs/ObtenerByNNAId/${this.idNna}`, 'NNA').subscribe({
            next: (resp: any) => {
              const contactos = resp?.datos ?? resp ?? [];
              const cuidador = contactos.find((c: any) => c.cuidador) ?? contactos[0];
              if (cuidador) {
                this.datosNNA.cuidadorTelefono = (cuidador.telefonos ?? '').split(',')[0]?.trim() ?? '';
                this.datosNNA.cuidadorNombres = cuidador.nombres ?? this.datosNNA.cuidadorNombres;
              }
            },
            error: () => {}
          });
        }

        try {
          const [regimenAfiliacion, nombreDeptoOrigen, nombreMuniOrigen, nombreDeptoActual, nombreMuniActual] = await Promise.all([
            this.getNombreTipoAfiliacion(this.datosNNA.tipoRegimenSSId),
            this.getNombreDepto(this.datosNNA.residenciaOrigenMunicipioId),
            this.getNombreMuni(this.datosNNA.residenciaOrigenMunicipioId),
            this.getNombreDepto(this.datosNNA.residenciaActualMunicipioId),
            this.getNombreMuni(this.datosNNA.residenciaActualMunicipioId)
          ]);

          this.regimenAfiliacion = regimenAfiliacion;
          this.nombreDeptoOrigen = nombreDeptoOrigen;
          this.nombreMuniOrigen = nombreMuniOrigen;
          this.nombreDeptoActual = nombreDeptoActual;
          this.nombreMuniActual = nombreMuniActual;
        } catch (error) {
          console.error('Error al cargar datos de NNA', error);
        }
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  loadDatosBasicosNNA() {
    this.repos.get_withoutParameters(`NNA/DatosBasicosNNAById/${this.idNna}`, 'NNA').subscribe({
      next: (datosBasicosData: any) => {
        this.datosBasicosNNA = datosBasicosData;
        //this.applyFilter('0');
      },
      error: (err: any) => console.error('Error al cargar datos básicos del NNA', err)
    });
  }

    loadSeguimientoAlertas() {
      this.repos.get(`Seguimiento/GetSeguimientosNNA/`, this.idNna, 'Seguimiento').subscribe({
        next: async (data: any) => {

          this.todasAlertas = data.reduce((alertasAcumuladas: any[], item: any) => {
            if (item.alertasSeguimientos) {
              return alertasAcumuladas.concat(item.alertasSeguimientos);
            }
            return alertasAcumuladas;
          }, []);

          // BUG-LZ 2026-06-19: ordenar por fecha de creacion de la alerta (desc).
          // Fallback a idAlertaSeguimiento desc cuando fechaCreacionAlerta venga vacia.
          this.todasAlertas.sort((a: any, b: any) => {
            const fa = a?.fechaCreacionAlerta ? new Date(a.fechaCreacionAlerta).getTime() : 0;
            const fb = b?.fechaCreacionAlerta ? new Date(b.fechaCreacionAlerta).getTime() : 0;
            if (fb !== fa) return fb - fa;
            return (b?.idAlertaSeguimiento ?? 0) - (a?.idAlertaSeguimiento ?? 0);
          });

          if (this.todasAlertas.length == 0) {
            console.warn('No se encontraron alertas en los seguimientos');
          }
          this.applyFilter('0');
        },
        error: (err: any) => console.error('Error al cargar datos del Seguimiento', err)
      });
    }



  calcularTiempoTranscurrido() {
    if (!this.fechaInicio) {
      return;
    }

    const fechaInicio = new Date(this.fechaInicio);
    const fechaFin = new Date(this.fechaFin);

    let anos = fechaFin.getFullYear() - fechaInicio.getFullYear();
    let meses = fechaFin.getMonth() - fechaInicio.getMonth();
    let dias = fechaFin.getDate() - fechaInicio.getDate();

    if (dias < 0) {
      meses--;
      const diasEnMes = new Date(fechaFin.getFullYear(), fechaFin.getMonth(), 0).getDate();
      dias += diasEnMes;
    }

    if (meses < 0) {
      anos--;
      meses += 12;
    }

    this.tiempoTranscurrido = `${anos} años, ${meses} meses, ${dias} días`;
  }

  async getNombreTipoAfiliacion(id: string): Promise<string> {
    let cod = id;
    let tipos: any[] = await this.tpp.getTPRegimenAfiliacion();

    let filtrado = tipos.filter(objeto => objeto.codigo === cod);

    return filtrado.length > 0 ? filtrado[0].nombre : 'No encontrado';
  }

  // BUG-LZ-050: getNombreMuni anterior pasaba codigo completo (ej "11001") a getTPCiudad
  // que arma URL `/TablaParametrica/Municipios/{codigo}` esperando depto (2 chars). Resultado
  // 404/lista vacia → 'No encontrado'. Fix: normalizar codigo + pasar prefijo depto al endpoint
  // de municipios y filtrar por codigo completo.
  async getNombreDepto(codigo: string): Promise<string> {
    if (codigo === null || codigo === undefined || codigo === '') {
      return 'No encontrado';
    }

    const raw = String(codigo).trim();
    const codDepto = raw.length >= 2 ? raw.substring(0, 2) : raw.padStart(2, '0');
    let deptos: any[] = await this.tpp.getTPDepartamento(codDepto);
    let filtrado = (deptos || []).filter(objeto => String(objeto.codigo) === codDepto);
    return filtrado.length > 0 ? filtrado[0].nombre : 'No encontrado';
  }

  async getNombreMuni(codigo: string): Promise<string> {
    if (codigo === null || codigo === undefined || codigo === '') {
      return 'No encontrado';
    }

    const raw = String(codigo).trim();
    const codigoCompleto = raw.length >= 5 ? raw.substring(0, 5) : raw.padStart(5, '0');
    const codDepto = codigoCompleto.substring(0, 2);
    let municipios: any[] = await this.tpp.getTPCiudad(codDepto);
    let filtrado = (municipios || []).filter(objeto => String(objeto.codigo) === codigoCompleto);
    return filtrado.length > 0 ? filtrado[0].nombre : 'No encontrado';
  }

  applyFilter(filter: string) {
    this.activeFilter = filter;
    this.CargarDatos(filter);
  }
  CargarDatos(filter: string) {
    if (filter === '0') {
      this.alertas= this.todasAlertas;
    } else {
      this.alertas = this.todasAlertas.filter(item => item.estadoId === Number(filter));
    }
  }

  getBadgeColor(estadoAlerta: any): string {
    switch (+estadoAlerta) {
      case 1:
        return 'bg-info'; // Amarillo
      case 2:
        return 'bg-warning'; // Amarillo
      case 3:
        return 'bg-danger'; // Rojo
      case 4:
        return 'bg-success'; // Verde
      case 5:
        return 'bg-dark'; // Gris
      default:
        return 'bg-secondary'; // Por defecto
    }
  }

  getDescripcionEstado(estadoAlerta: any): string {
    let estado = Number(estadoAlerta);
    switch (estado) {
      case 1:
        return 'IDENTIFICADA';
      case 2:
        return 'EN TRÁMITE';
      case 3:
        return 'SIN RESOLVER';
      case 4:
        return 'RESUELTA';
      case 5:
        return 'CERRADA POR CAUSAS EXTERNAS';
      default:
        return 'ERROR';
    }
  }

  onRowExpand(event: any) {
    for (let key in this.expandedRowKeys) {
      if (key !== event.data.idAlertaSeguimiento) {
        this.expandedRowKeys[key] = false;
      }
    }
    this.expandedRowKeys[event.data.idAlertaSeguimiento] = true;
  }

  onRowCollapse(event: any) {
    delete this.expandedRowKeys[event.data.idAlertaSeguimiento];
  }

  consultarNotificaciones(alertaId: any){

    this.notificacionesAlerta = [];

    this.repos.get('Notificacion/GetNotificationAlerta/', `${alertaId}`, 'Seguimiento').subscribe({
      next: (data: any) => {
        this.notificacionesAlerta = data;
      }
    });

  }

  visible: boolean = false;
  verCrearOficio: boolean = false;

  showDialog(alerta:any) {
    // BUG-024: abrir primero dialog seleccion plantilla
    this.alertaSeleccionada = alerta;
    this.plantillaSeleccionada = null;
    this.verDialogPlantilla = true;
    this.cargandoPlantillas = true;
    this.plantillasService.getPlantillasCorreo().subscribe({
      next: (data: any) => {
        const items = Array.isArray(data) ? data : [];
        this.plantillasOficio = items.filter((p: any) => (p.tipoPlantilla || '').toLowerCase().includes('oficio'));
        this.cargandoPlantillas = false;
      },
      error: () => {
        this.plantillasOficio = [];
        this.cargandoPlantillas = false;
      }
    });
  }

  cerrarDialogPlantilla() {
    this.verDialogPlantilla = false;
  }

  confirmarPlantillaYAbrirOficio() {
    this.verDialogPlantilla = false;
    this.verCrearOficio = true;
  }

  closeCrearOficio(){
    this.verCrearOficio = false;
    this.plantillaSeleccionada = null;
  }

  verNotificaciones: boolean = false;

  showNotificaciones() {
    this.verNotificaciones = true;
  }

  closeVerNotificaciones(){
    this.verNotificaciones = false;
  }

  verRespuestas: boolean = false;

  showRespuestas() {
    this.verRespuestas = true;
  }

  closeVerRespuestas(){
    this.verRespuestas = false;
  }


  ExportAlertas: Alerta | undefined;
  ExportNotificacion: NotificacionAlerta[] = [];
  notificacionesAlertaExport: NotificacionAlerta[] = [];

  iniciarDescarga(alert: any): void {
  this.confirmationService.confirm({
    message: '¿Está seguro que desea exportar esta alerta?',
    header: 'Confirmación de Exportación',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sí',
    rejectLabel: 'Cancelar',
    acceptButtonStyleClass: 'custom-accept-btn',
    rejectButtonStyleClass: 'custom-reject-btn me-2',
    accept: async () => {
      if (!alert || !alert.alertaId) {
        console.error('Alerta inválida o sin alertaId');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Alerta inválida para exportar'
        });
        return;
      }

      try {
        if (this.descargar == false) {
          this.descargar = true;
          
          const archivo: Blob = await this.repos.getFile(
            'Alerta/Exportar', 
            alert.alertaId.toString(), 
            apis.seguimiento
          );

          if (archivo.size === 0) {
            throw new Error('Archivo vacío recibido del servidor');
          }

          const blobUrl = window.URL.createObjectURL(archivo);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = `${this.datosNNA.id} - ${this.datosNNA.nombreCompleto.trim()}.zip`;
          link.style.display = 'none';

          document.body.appendChild(link);
          link.click();

          setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
          }, 100);

          this.descargar = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Exportación completada',
            detail: 'El archivo fue descargado correctamente'
          });
        }
      } catch (error: any) {
        this.descargar = false;
        let mensajeError = 'Error al descargar el archivo';
        if (error.status === 404) {
          mensajeError = 'El archivo solicitado no existe';
        } else if (error.status === 500) {
          mensajeError = 'Error del servidor al generar el archivo';
        } else if (error.message?.includes('vacío')) {
          mensajeError = 'El servidor devolvió un archivo vacío';
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Error en exportación',
          detail: mensajeError
        });
      }
    }
  });
}

  obtenerNotificacionesExport(alertaId: string): Promise<NotificacionAlerta[]> {
    return new Promise((resolve, reject) => {
      this.repos.get('Notificacion/GetNotificationAlerta/', `${alertaId}`, 'Seguimiento').subscribe({
        next: (data) => {
          const notifications = (data as NotificacionAlerta[]) || [];
          if (Array.isArray(notifications) && notifications.length > 0) {
            const processedNotifications = notifications.map((notif) => ({
              entidadNotificada: notif.entidadNotificada || '',
              fechaNotificacion: notif.fechaNotificacion || new Date(),
              asuntoNotificacion: notif.asuntoNotificacion || '',
              fechaRespuesta: notif.fechaRespuesta || new Date()
            }));
            resolve(processedNotifications);
          } else {
            console.warn('No se encontraron notificaciones para la alerta');
            resolve([]);
          }
        },
        error: (err) => {
          console.error('Error al obtener notificaciones:', err);
          reject(err);
        }
      });
    });
  }
}
