import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SeguimientoStepsComponent } from '../seguimiento-steps/seguimiento-steps.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { TablasParametricas } from '../../../../../core/services/tablasParametricas';
import { Parametricas } from '../../../../../models/parametricas.model';
import { ActivatedRoute, Router } from '@angular/router';
import { InfoAdherencia } from '../../../../../models/infoAdherencia.model';
import { NNA } from '../../../../../models/nna.model';
import { TpParametros } from '../../../../../core/services/tpParametros';
import { NNAService } from '../../../../../core/services/nnaService';
import { EstadoNnaComponent } from "../../../estado-nna/estado-nna.component";
import { AlertasTratamiento } from '../../../../../models/alertasTratamiento.model';
import { SeguimientoGuardarComponent } from "../seguimiento-guardar/seguimiento-guardar.component";
import { SeguimientoGestion } from '../../../../../models/seguimientoGestion.model';

@Component({
  selector: 'app-seguimiento-adherencia',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, CardModule, SeguimientoStepsComponent, ReactiveFormsModule,
    DropdownModule, FormsModule, InputTextModule, CheckboxModule, TableModule, EstadoNnaComponent, SeguimientoGuardarComponent],
  templateUrl: './seguimiento-adherencia.component.html',
  styleUrl: './seguimiento-adherencia.component.css'
})

export class SeguimientoAdherenciaComponent implements OnInit {
  nna: NNA = new NNA();
  id: string | undefined;
  
  adherencia: InfoAdherencia ={
    id: 0,
    haInasistidoTratamiento: false,
    tiempoInasistencia: 0,
    idUnidadTiempo: 0,
    idCausaInasistencia: 0,
    causaInasistenciaOtra: '',
    estudiandoActualmente: false,
    haInasistidoEstudio: false,
    tiempoInasistenciaEstudio: 0,
    idUnidadTiempoEstudio: 0,
    hanInformadoDiagnosticos: false,
    observacion: ''
  };
  unidadesTiempo: Parametricas[] = [];
  causasInasistencia: Parametricas[] = [];

  selectedUnidadTiempo: Parametricas | undefined;
  selectedUnidadTiempo2: Parametricas | undefined;
  selectedCausaInasistencia: Parametricas | undefined;

  isLoadingUnidadesTiempo: boolean = true;
  isLoadingCausasInasistencia: boolean = true;

  alertas: AlertasTratamiento[] = [];

  idContacto: string | undefined;

  estado:string = 'Registrado';
  items: MenuItem[] = [];
  saving!: boolean;

  showGuardarSeguimiento: boolean = false;

  constructor(private tpp: TpParametros, private tp: TablasParametricas, private router: Router, private routeAct: ActivatedRoute, private nnaService: NNAService) {
  }

  async ngOnInit(): Promise<void> {
    this.routeAct.paramMap.subscribe(() => {
      this.alertas = history.state.alertas;
      this.idContacto = history.state.idContacto;
    });

    this.id = this.routeAct.snapshot.paramMap.get('id')!;
    this.nna = await this.tpp.getNNA(this.id);

    this.items = [
      { label: 'Seguimientos', routerLink: '/gestion/seguimientos' },
      { label: `${this.nna.primerNombre} ${this.nna.primerApellido}`, routerLink: `/gestion/seguimientos/datos-seguimiento/${this.id}` },
    ];

    this.unidadesTiempo =  await this.tp.getTP('UnidadMedidaEdad');
    this.isLoadingUnidadesTiempo = false;

    this.causasInasistencia =  await this.tpp.getCausaInasistencia();
    this.isLoadingCausasInasistencia = false;
  }

  HaInasistidoTratamiento(value: boolean) {
    this.nna.tratamientoHaDejadodeAsistir = value;
    if (value) {
      this.nna.tratamientoCuantoTiemposinAsistir = 1;
    }
  }

  EstudiandoActualmente(value: boolean) {
    this.nna.tratamientoEstudiaActualmente = value;
    if (!value) {
      this.nna.tratamientoHaDejadodeAsistirColegio = false;
      this.nna.tratamientoTiempoInasistenciaColegio = 0;
      this.nna.tratamientoCausasInasistenciaId = '';
      this.selectedUnidadTiempo2 = undefined;
    }
  }

  HaInasistidoEstudio(value: boolean) {
    this.nna.tratamientoHaDejadodeAsistirColegio = value;
    if (value) {
      this.nna.tratamientoTiempoInasistenciaColegio = 1;
    }
  }

  async Siguiente() {
    this.saving = true;
    await this.Actualizar();
    this.router.navigate([`/gestion/seguimientos/gestionar-seguimiento/${this.id}`], {
      state: { alertas: this.alertas, idContacto: this.idContacto, skipGuard: true }
    }).then(() => {
      window.scrollTo(0, 0);
    });
    this.saving = false;
  }

  async Actualizar() {
    this.nna.tratamientoUnidadMedidaIdTiempoId = this.selectedUnidadTiempo?.codigo ?? '';
    this.nna.tratamientoTiempoInasistenciaUnidadMedidaId = this.selectedUnidadTiempo2?.codigo ?? '';
    this.nna.tratamientoCausasInasistenciaId = this.selectedCausaInasistencia?.codigo  ?? '';
    await this.nnaService.putNNA(this.nna);
  }

  abrirGuardarYReagendar() {
    this.showGuardarSeguimiento = true;
  }

  cerrarGuardarYReagendar() {
    this.showGuardarSeguimiento = false;
  }

  get seguimientoActual(): SeguimientoGestion {
    return {
      nnaId: this.nna.id ? Number(this.nna.id): 0,
      fechaSeguimiento: new Date(),
      estadoId: 1,
      contactoNNAId: this.idContacto ? Number(this.idContacto): 0,
      telefono: '',
      usuarioId: '',
      solicitanteId: 0,
      fechaSolicitud: new Date(),
      tieneDiagnosticos: false,
      observacionesSolicitante: '',
      observacionAgente: '',
      ultimaActuacionAsunto: '',
      ultimaActuacionFecha: new Date(),
      nombreRechazo: '',
      parentescoRechazo: '',
      razonesRechazo: '',
      alertas: [],
      alertasPendientes: []
    };
  }

}
