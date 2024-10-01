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
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-consultar-alertas',
  standalone: true,
  imports: [CommonModule, BadgeModule, CardModule, TableModule, RouterModule, ButtonModule, DividerModule],
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
    private messageService: MessageService
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
    this.repos.get_withoutParameters(`/NNA/${this.idNna}`, 'NNA').subscribe({
      next: async (nnaData: any) => {
        this.datosNNA = nnaData;
        this.fechaInicio = new Date(this.datosNNA.fechaNacimiento);
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
    this.repos.get_withoutParameters(`/NNA/DatosBasicosNNAById/${this.idNna}`, 'NNA').subscribe({
      next: (datosBasicosData: any) => {
        this.datosBasicosNNA = datosBasicosData;
        this.applyFilter('0');
      },
      error: (err: any) => console.error('Error al cargar datos básicos del NNA', err)
    });
  }

  /*loadSeguimientoAlertas() {
    this.repos.get(`Seguimiento/GetSeguimientosNNA/`, this.idNna, 'Seguimiento').subscribe({
      next: async (data: any) => {

        const filtradoPorIdSeguimiento = data.filter((item: any) => item.idSeguimiento === Number(this.idSeguimiento));

        if (filtradoPorIdSeguimiento.length > 0 && filtradoPorIdSeguimiento[0].alertasSeguimientos) {
          this.todasAlertas = filtradoPorIdSeguimiento[0].alertasSeguimientos;
        } else {
          console.warn('No se encontró el seguimiento o no hay alertas para el seguimiento');
        }
      },
      error: (err: any) => console.error('Error al cargar datos del Seguimiento', err)
    });
  }*/

    loadSeguimientoAlertas() {
      this.repos.get(`Seguimiento/GetSeguimientosNNA/`, this.idNna, 'Seguimiento').subscribe({
        next: async (data: any) => {

          this.todasAlertas = data.reduce((alertasAcumuladas: any[], item: any) => {
            if (item.alertasSeguimientos) {
              return alertasAcumuladas.concat(item.alertasSeguimientos);
            }
            return alertasAcumuladas;
          }, []);

          if (this.todasAlertas.length > 0) {
            console.log('Alertas cargadas:', this.todasAlertas);
          } else {
            console.warn('No se encontraron alertas en los seguimientos');
          }
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

    this.repos.get('Notificacion/GetNotificationAlerta/', `${alertaId}`, 'Seguimiento').subscribe({
      next: (data: any) => {
        this.notificacionesAlerta = data;
      }
    });
  }

}
