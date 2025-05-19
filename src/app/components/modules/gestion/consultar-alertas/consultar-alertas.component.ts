import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
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
import { from, map, Observable } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { VerNotificacionComponent } from '../oficio-notificacion/ver-notificacion/ver-notificacion.component';
import { VerRespuestaComponent } from '../oficio-notificacion/ver-respuesta/ver-respuesta.component';
import { Alerta, NotificacionAlerta } from '../../../../models/ExportConsutarAlertas.model';
import { ToastModule } from 'primeng/toast';
import { ExcelExportService } from '../../../../services/excel-export.service';
import { CrearOficioComponent } from '../oficio-notificacion/crear-oficio/crear-oficio.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


@Component({
  selector: 'app-consultar-alertas',
  standalone: true,
  imports: [CommonModule, BadgeModule, CardModule, TableModule, RouterModule, ButtonModule, DividerModule, DialogModule, VerNotificacionComponent, VerRespuestaComponent, ToastModule, CrearOficioComponent,ConfirmDialogModule
  ],
  templateUrl: './consultar-alertas.component.html',
  styleUrls: ['./consultar-alertas.component.css'],
  providers: [MessageService,ConfirmationService]
})
export class ConsultarAlertasComponent implements OnInit {

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



  constructor(
    private route: ActivatedRoute,
    private repos: GenericService,
    private tpp: TpParametros,
    private messageService: MessageService,
    private excelExportService: ExcelExportService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit() {
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

  async getNombreDepto(codigo: string): Promise<string> {

    if (!codigo) {
      return 'No encontrado';
    }

    let cod = codigo.substring(0, 2);
    let deptos: any[] = await this.tpp.getTPDepartamento(cod);

    let filtrado = deptos.filter(objeto => objeto.codigo === cod);

    return filtrado.length > 0 ? filtrado[0].nombre : 'No encontrado';
  }

  async getNombreMuni(codigo: string): Promise<string> {

    if (!codigo) {
      return 'No encontrado';
    }

    let deptos: any[] = await this.tpp.getTPCiudad(codigo);

    let filtrado = deptos.filter(objeto => objeto.codigo === codigo);

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
      if (key !== event.data.alertaId) {
        this.expandedRowKeys[key] = false;
      }
    }
    this.expandedRowKeys[event.data.alertaId] = true;
  }

  onRowCollapse(event: any) {
    delete this.expandedRowKeys[event.data.alertaId];
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
    this.alertaSeleccionada = alerta;
    this.verCrearOficio = true;
  }

  closeCrearOficio(){
    this.verCrearOficio = false;
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
      rejectButtonStyleClass: 'custom-reject-btn',
      accept: async () => {
        if (!alert || !alert.alertaId) {
          console.error('Alerta inválida o sin alertaId');
          return;
        }

        try {
          const notifications = await this.obtenerNotificacionesExport(alert.alertaId);

          this.ExportAlertas = {
            ultimaFechaSeguimiento: alert.ultimaFechaSeguimiento || null,
            categoriaAlerta: alert.categoriaAlerta || null,
            subcategoriaAlerta: alert.subcategoriaAlerta || null,
            observaciones: alert.observaciones || null,
            estadoId: this.getDescripcionEstado(alert.estadoId) || null,
            notificacionesAlerta: notifications
          };

          this.excelExportService.exportToExcelDesdeConsultarAlertas(
            this.ExportAlertas,
            this.idNna,
            this.datosBasicosNNA.nombreCompleto
          );

          this.messageService.add({
            severity: 'success',
            summary: 'Exportación completada',
            detail: 'El archivo fue generado y está listo para descarga.'
          });

        } catch (error) {
          console.error('Error durante la descarga de la alerta:', error);
          this.messageService.add({ severity: 'warn', summary: 'Importante', detail: 'Sin notificaciones.' });
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
