import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { GenericService } from '../../../../services/generic.services';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { NNA } from '../../../../models/nna.model';
import { NNAInfoDiagnostico } from '../../../../models/nnaInfoDiagnostico.model';
import { SeguimientoCntFiltros } from '../../../../models/seguimientoCntFiltros.model';
import { Parametricas } from '../../../../models/parametricas.model';
import { SubcategoriaAlerta } from '../../../../models/subcategoriaAlerta.model';
import { TpParametros } from '../../../../core/services/tpParametros';
import { from, map, Observable } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-consultar-alertas',
  standalone: true,
  imports: [CommonModule, BadgeModule, CardModule, TableModule, RouterModule, ButtonModule],
  templateUrl: './consultar-alertas.component.html',
  styleUrls: ['./consultar-alertas.component.css'],
  providers: [MessageService]
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
    fechaNacimiento: ''
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

  alertas: any[] = [];
  categoriasAlerta: any;
  subcategoriasAlerta: any;
  alertaSeleccionada!: any;

  expandedRows = {};

  constructor(
    private route: ActivatedRoute,
    private repos: GenericService,
    private tpp: TpParametros,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.idSeguimiento = params.get('id') || ''; // Recupera el valor del parámetro
    });

    this.repos.get_withoutParameters(`Seguimiento/${this.idSeguimiento}`, 'Seguimiento').subscribe({
      next: (data: any) => {
        this.seguimiento = data;
        this.idNna = this.seguimiento.nnaId;
        this.repos.get_withoutParameters(`/NNA/${this.idNna}`, 'NNA').subscribe({
          next: (data: any) => {
            this.datosNNA = data;
            this.fechaInicio = new Date(this.datosNNA.fechaNacimiento);
            this.calcularTiempoTranscurrido();
            this.getNombreDepto(this.datosNNA.residenciaOrigenMunicipioId).then(nombreDepto => {
              this.nombreDeptoOrigen = nombreDepto;
            });
            this.getNombreMuni(this.datosNNA.residenciaOrigenMunicipioId).then(nombreDepto => {
              this.nombreMuniOrigen = nombreDepto;
            });
            this.getNombreDepto(this.datosNNA.residenciaOrigenMunicipioId).then(nombreDepto => {
              this.nombreDeptoActual = nombreDepto;
            });
            this.getNombreMuni(this.datosNNA.residenciaOrigenMunicipioId).then(nombreDepto => {
              this.nombreMuniActual = nombreDepto;
            });
          }
        });
        this.repos.get_withoutParameters(`/NNA/DatosBasicosNNAById/${this.idNna}`, 'NNA').subscribe({
          next: (data: any) => {
            this.datosBasicosNNA = data;
            this.applyFilter('0');
          }
        });
      }
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

  async getNombreDepto(codigo: string): Promise<string> {
    let cod = codigo.substring(0, 2);
    let deptos: any[] = await this.tpp.getTPDepartamento(cod);

    let filtrado = deptos.filter(objeto => objeto.codigo === cod);

    return filtrado.length > 0 ? filtrado[0].nombre : 'No encontrado';
  }

  async getNombreMuni(codigo: string): Promise<string> {
    let deptos: any[] = await this.tpp.getTPCiudad(codigo);

    let filtrado = deptos.filter(objeto => objeto.codigo === codigo);

    return filtrado.length > 0 ? filtrado[0].nombre : 'No encontrado';
  }

  applyFilter(filter: string) {
    this.activeFilter = filter;
    this.CargarDatos(filter);
  }

  //////////////IMPORTANTE ESTO ES temporal
  CargarDatos(filter: string) {
    let arreglo = [
      {
        'idAlerta':'1',
        'ultimaFechaSeguimiento':'2014-01-21T06:50:39.6556624',
        'idCategoria':'1',
        'descripcionCategoria':'1. Pertinencia',
        'idSubcategoria':'4',
        'descripcionSubcategoria':'D. No contar con mecanismos para la recepción de peticiones específicas, quejas y reclamos acerca de la atención de los niños y menores de edad con cáncer.',
        'observaciones':'Observación de prueba.',
        'estadoAlertaId':'1',
        'notificaciones':[
          {
            'idNotificacion': 1,
            'entidad': 'Sanitas EPS',
            'fechaNotificacion':'2014-02-21T06:50:39.6556624',
            'asuntoNotificaion':'Notificando todo.',
            'notificacion':'notificacion.pdf',
            'respuesta':'respuesta.pdf',
            'fechaRespuesta':'2014-02-21T06:50:39.6556624'
          },
          {
            'idNotificacion': 2,
            'entidad': 'Sanitas EPS',
            'fechaNotificacion':'2014-02-21T06:50:39.6556624',
            'asuntoNotificaion':'Notificando todo.',
            'notificacion':'notificacion.pdf',
            'respuesta':'respuesta.pdf',
            'fechaRespuesta':'2014-02-21T06:50:39.6556624'
          }
        ]
      },
      {
        'idAlerta':'2',
        'ultimaFechaSeguimiento':'2014-01-21T06:50:39.6556624',
        'idCategoria':'1',
        'descripcionCategoria':'1. Pertinencia',
        'idSubcategoria':'4',
        'descripcionSubcategoria':'D. No contar con mecanismos para la recepción de peticiones específicas, quejas y reclamos acerca de la atención de los niños y menores de edad con cáncer.',
        'observaciones':'Observación de prueba.',
        'estadoAlertaId':'2',
        'notificaciones':[
          {
            'idNotificacion': 1,
            'entidad': 'Sanitas EPS',
            'fechaNotificacion':'2014-02-21T06:50:39.6556624',
            'asuntoNotificaion':'Notificando todo.',
            'notificacion':'notificacion.pdf',
            'respuesta':'respuesta.pdf',
            'fechaRespuesta':'2014-02-21T06:50:39.6556624'
          },
          {
            'idNotificacion': 2,
            'entidad': 'Sanitas EPS',
            'fechaNotificacion':'2014-02-21T06:50:39.6556624',
            'asuntoNotificaion':'Notificando todo.',
            'notificacion':'notificacion.pdf',
            'respuesta':'respuesta.pdf',
            'fechaRespuesta':'2014-02-21T06:50:39.6556624'
          }
        ]
      },
      {
        'idAlerta':'3',
        'ultimaFechaSeguimiento':'2014-01-21T06:50:39.6556624',
        'idCategoria':'1',
        'descripcionCategoria':'1. Pertinencia',
        'idSubcategoria':'4',
        'descripcionSubcategoria':'D. No contar con mecanismos para la recepción de peticiones específicas, quejas y reclamos acerca de la atención de los niños y menores de edad con cáncer.',
        'observaciones':'Observación de prueba.kwbrñgqrng{lqknrwekjgbñqjdbñgljbñdslbgñlajsbdljgbñALJBSDÑGLJBAÑSJLDFBGALJBÑJAGBJjljbsñgjbsdñfljbgslndfñblnsldfnbñlnsdfñlbndlfnblnsdfñlbnñsdlnjfbñjsndñfjn',
        'estadoAlertaId':'3',
        'notificaciones':[
        ]
      },
      {
        'idAlerta':'4',
        'ultimaFechaSeguimiento':'2014-01-21T06:50:39.6556624',
        'idCategoria':'1',
        'descripcionCategoria':'1. Pertinencia',
        'idSubcategoria':'4',
        'descripcionSubcategoria':'D. No contar con mecanismos para la recepción de peticiones específicas, quejas y reclamos acerca de la atención de los niños y menores de edad con cáncer.',
        'observaciones':'Observación de prueba.',
        'estadoAlertaId':'4',
        'notificaciones':[
        ]
      },
      {
        'idAlerta':'5',
        'ultimaFechaSeguimiento':'2014-01-21T06:50:39.6556624',
        'idCategoria':'1',
        'descripcionCategoria':'1. Pertinencia',
        'idSubcategoria':'4',
        'descripcionSubcategoria':'D. No contar con mecanismos para la recepción de peticiones específicas, quejas y reclamos acerca de la atención de los niños y menores de edad con cáncer.',
        'observaciones':'Observación de prueba.',
        'estadoAlertaId':'5',
        'notificaciones':[
        ]
      }
    ];

    if (filter === '0') {
      this.alertas= arreglo;
    } else {
      this.alertas = arreglo.filter(item => item.estadoAlertaId === filter);
    }


    /*const estadosMap: { [key: string]: number[] } = {
      '0': [1, 2, 3, 4, 5],
      '1': [1],
      '2': [2],
      '3': [3],
      '4': [4],
      '5': [5]
    };

    const estados = { estados: estadosMap[filter] };

    this.repos.post('Alerta/ConsultarAlertasEstados', estados, 'Seguimiento').subscribe({
      next: (data: any) => {
        this.alertas = data;
      }
    });*/
  }

  getBadgeColor(estadoAlerta: string): string {
    switch (estadoAlerta) {
      case '1':
        return 'bg-info'; // Amarillo
      case '2':
        return 'bg-warning'; // Amarillo
      case '3':
        return 'bg-danger'; // Rojo
      case '4':
        return 'bg-success'; // Verde
      case '5':
        return 'bg-dark'; // Gris
      default:
        return 'bg-secondary'; // Por defecto
    }
  }

  getDescripcionEstado(estadoAlerta: string): string {
    switch (estadoAlerta) {
      case '1':
        return 'IDENTIFICADA';
      case '2':
        return 'EN TRÁMITE';
      case '3':
        return 'SIN RESOLVER';
      case '4':
        return 'RESUELTA';
      case '5':
        return 'CERRADA POR CAUSAS EXTERNAS';
      default:
        return 'ERROR';
    }
  }

  onRowExpand(event: TableRowExpandEvent) {
      this.messageService.add({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
  }

  onRowCollapse(event: TableRowCollapseEvent) {
      this.messageService.add({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
  }

}
