import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { SeguimientoAlertasComponent } from '../../seguimiento-alertas/seguimiento-alertas.component';
import { SeguimientoStepsComponent } from '../seguimiento-steps/seguimiento-steps.component';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { TablasParametricas } from '../../../../../core/services/tablasParametricas';
import { TpParametros } from '../../../../../core/services/tpParametros';
import { InfoDiagnostico } from '../../../../../models/infoDiagnostico.model';
import { Parametricas } from '../../../../../models/parametricas.model';
import { SeguimientoHistorialComponent } from "../seguimiento-historial/seguimiento-historial.component";
import { CommonModule } from '@angular/common';
import { InfoSeguimientoNnaComponent } from "../info-seguimiento-nna/info-seguimiento-nna.component";
import { SeguimientoGuardarComponent } from "../seguimiento-guardar/seguimiento-guardar.component";
import { EstadoNnaComponent } from "../../../estado-nna/estado-nna.component";
import { AlertasTratamiento } from '../../../../../models/alertasTratamiento.model';
import { NNA } from '../../../../../models/nna.model';
import { SeguimientoGestion } from '../../../../../models/seguimientoGestion.model';
import { apis } from '../../../../../models/apis.model';
import { GenericService } from '../../../../../services/generic.services';
import { ContactoNNA } from '../../../../../models/contactoNNA.model';

@Component({
  selector: 'app-seguimiento-gestionar',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, CardModule, SeguimientoStepsComponent, ReactiveFormsModule, DropdownModule, TableModule, FormsModule, InputTextModule, SeguimientoAlertasComponent, SeguimientoHistorialComponent, InfoSeguimientoNnaComponent, SeguimientoGuardarComponent, EstadoNnaComponent],
  templateUrl: './seguimiento-gestionar.component.html',
  styleUrl: './seguimiento-gestionar.component.css'
})
export class SeguimientoGestionarComponent {

  estado:string = 'Sin Diagnóstico';
  items: MenuItem[] = [];
  estados: Parametricas[] = [];
  diagnosticos: Parametricas[] = [];
  IPS: Parametricas[] = [];

  selectedDiagnostico: Parametricas | undefined;
  selectedEstado: Parametricas | undefined;
  selectedIPS: Parametricas | undefined;

  isLoadingDiagnostico: boolean = true;
  isLoadingEstados: boolean = true;
  isLoadingIPS: boolean = true;
  showDialog: boolean = false;

  estadoFallecido: boolean = false;
  estadoEnTratamiento: boolean = false;
  estadoSinTratamiento: boolean = false;
  estadoSinDiagnostico: boolean = false;
  concatenatedAlertas: string = '';

  seguimiento: SeguimientoGestion = {
    nnaId: 0,
    fechaSeguimiento: new Date(),
    estadoId: 0,
    contactoNNAId: 0,
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
    razonesRechazo: ''
  };

  contacto: ContactoNNA = {
    id: 0,
    nnaId: 0,
    nombres: '',
    parentescoId: 0,
    parentesco: '',
    cuidador: false,
    telefonos: '',
    email: '',
    estado: false
  };

  alertasPendientes: AlertasTratamiento[] = [];

  alertas: AlertasTratamiento[] = [];
  nna: NNA = new NNA();
  id: string | undefined;
  idContacto: string | undefined;
  idEstadoSeguimiento: number = 0;
  cntDias: number = 0;

  constructor(private tpp: TpParametros, private tp: TablasParametricas, private router: ActivatedRoute, private gs: GenericService) {
  }
  
  async ngOnInit(): Promise<void> {
    this.id = this.router.snapshot.paramMap.get('id')!;
    this.nna = await this.tpp.getNNA(this.id);

    this.router.paramMap.subscribe(() => {
      this.alertas = history.state.alertas;
      this.idContacto = history.state.idContacto;
    });

    if (this.alertas) {
      this.concatenatedAlertas = this.alertas.map(alerta => alerta.categoriaAlerta).join(', ');
    } else {
      this.concatenatedAlertas = '';
    }

    if (this.idContacto) {
      this.gs.getAsync('ContactoNNAs/Obtener', `/${this.idContacto}`, apis.nna).then((data: any) => {
        this.contacto = data.datos;
      }).catch((error: any) => {
        console.error('Error fetching contact list', error);
      });
    }

    this.items = [
      { label: 'Seguimientos', routerLink: '/gestion/seguimiento' },
      { label: 'Ana Ruiz', routerLink: '/gestion/seguimiento' },
    ];

    this.estados = await this.tpp.getTpEstadosNNA();
    this.selectedEstado = this.estados.find(x => x.id == this.nna.estadoId);
    this.isLoadingEstados = false;
    this.diagnosticos =  await this.tpp.getDiagnosticos();
    this.isLoadingDiagnostico = false;

    this.validarEstado();
    this.CargarData();
    
  }

  CargarData() {
    this.seguimiento.estadoId = this.idEstadoSeguimiento;
    this.seguimiento.fechaSeguimiento = new Date();
    this.seguimiento.fechaSeguimiento.setDate(this.seguimiento.fechaSeguimiento.getDate() + this.cntDias);
    this.seguimiento.nnaId = this.nna.id;
    this.seguimiento.contactoNNAId = this.contacto.id;
    this.seguimiento.telefono = this.contacto.telefonos;
    this.seguimiento.usuarioId = '1';
    this.seguimiento.solicitanteId = 1;
    this.seguimiento.fechaSolicitud = new Date();
    this.seguimiento.tieneDiagnosticos = this.nna.diagnosticoId > 0;
  }

  validarEstado() {
    switch (this.selectedEstado?.id) {
      case 1:
        this.idEstadoSeguimiento = 3; break;
      case 2:
        this.idEstadoSeguimiento = 2; this.cntDias = 8; break;
      case 3:
        this.idEstadoSeguimiento = 2; this.cntDias = 8; break;
      case 4:
        this.idEstadoSeguimiento = 2; this.cntDias = 15; break;
      case 5:
        this.idEstadoSeguimiento = 2; this.cntDias = 15; break;
      case 6:
        this.idEstadoSeguimiento = 2; this.cntDias = 8; break;
      case 7:
        this.idEstadoSeguimiento = 2; this.cntDias = 8; break;
      case 8:
        this.idEstadoSeguimiento = 2; this.cntDias = 30; break;
      case 9:
        this.idEstadoSeguimiento = 2; this.cntDias = -1; break;
      case 10:
        this.idEstadoSeguimiento = 3; break;
      case 11:
        this.idEstadoSeguimiento = 3; break;
      case 12:
        this.idEstadoSeguimiento = 3; break;
      case 13:
        this.idEstadoSeguimiento = 3; break;
      case 14:
        this.idEstadoSeguimiento = 3; break;
      case 15:
        this.idEstadoSeguimiento = 1; break;
      default:
        this.idEstadoSeguimiento = 0; // or any default value you want to set
        break;
    }
  }

  guardar() {
    this.seguimiento = {
      nnaId: this.nna.id,
      fechaSeguimiento: this.seguimiento.fechaSeguimiento,
      estadoId: this.idEstadoSeguimiento,
      contactoNNAId: this.contacto.id,
      telefono: this.contacto.telefonos,
      usuarioId: '1',
      solicitanteId: 1,
      fechaSolicitud: new Date(),
      tieneDiagnosticos: this.nna.diagnosticoId > 0,
      observacionesSolicitante: '',
      observacionAgente: this.seguimiento.observacionAgente,
      ultimaActuacionAsunto: '',
      ultimaActuacionFecha: new Date(),
      nombreRechazo: '',
      parentescoRechazo: '',
      razonesRechazo: ''
    };
    console.log('Datos del seguimiento:', this.seguimiento);
    this.showDialog = true;
    
  }
}
