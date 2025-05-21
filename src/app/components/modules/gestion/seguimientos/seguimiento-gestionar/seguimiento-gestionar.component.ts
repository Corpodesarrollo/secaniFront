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
import { EstadoAlerta } from '../../../../../models/estadoAlerta.model';
import { user, User } from '../../../../../core/services/userService';

@Component({
  selector: 'app-seguimiento-gestionar',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, CardModule, SeguimientoStepsComponent, ReactiveFormsModule, DropdownModule, TableModule, FormsModule, InputTextModule, SeguimientoAlertasComponent, SeguimientoHistorialComponent, InfoSeguimientoNnaComponent, SeguimientoGuardarComponent, EstadoNnaComponent],
  templateUrl: './seguimiento-gestionar.component.html',
  styleUrl: './seguimiento-gestionar.component.css'
})
export class SeguimientoGestionarComponent {

  user = new User();

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
    razonesRechazo: '',
    alertas: [],
    alertasPendientes: []
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

  alertas: AlertasTratamiento[] = [];
  alertasPendientes: EstadoAlerta[] = [];
  nna: NNA = new NNA();
  id: number | undefined;
  idContacto: string | undefined;
  idEstadoSeguimiento: number = 0;
  cntDias: number = 0;
  saving: boolean = false;

  constructor(private tpp: TpParametros, private tp: TablasParametricas, private router: ActivatedRoute, private gs: GenericService) {
  }
  
  async ngOnInit(): Promise<void> {
    let id = this.router.snapshot.paramMap.get('id')!;
    this.nna = await this.tpp.getNNA(id?.toString() || '');

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

    //alertas pendientes
    this.gs.getAsync('Alerta/ConsultarAlertasUltimoSeguimiento', `/${id}`, apis.seguimiento).then((data: any) => {
      this.alertasPendientes = data;
      console.log('Alertas pendientes:', this.alertasPendientes);
    }).catch((error: any) => {
      console.error('Error fetching contact list', error);
    });

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
    this.seguimiento.usuarioId = User.id ?? "";
    this.seguimiento.solicitanteId = 1;
    this.seguimiento.fechaSolicitud = new Date();
    this.seguimiento.tieneDiagnosticos = this.nna.diagnosticoId > 0;
  }

  validarEstado() {
    const estadoDiasMap: { [key: number]: { idEstadoSeguimiento: number, cntDias: number } } = {
      1: { idEstadoSeguimiento: 3, cntDias: 0 },
      2: { idEstadoSeguimiento: 2, cntDias: 8 },
      3: { idEstadoSeguimiento: 2, cntDias: 8 },
      4: { idEstadoSeguimiento: 2, cntDias: 15 },
      5: { idEstadoSeguimiento: 2, cntDias: 15 },
      6: { idEstadoSeguimiento: 2, cntDias: 8 },
      7: { idEstadoSeguimiento: 2, cntDias: 8 },
      8: { idEstadoSeguimiento: 2, cntDias: 30 },
      9: { idEstadoSeguimiento: 2, cntDias: -1 },
      10: { idEstadoSeguimiento: 3, cntDias: 0 },
      11: { idEstadoSeguimiento: 3, cntDias: 0 },
      12: { idEstadoSeguimiento: 3, cntDias: 0 },
      13: { idEstadoSeguimiento: 3, cntDias: 0 },
      14: { idEstadoSeguimiento: 3, cntDias: 0 },
      15: { idEstadoSeguimiento: 1, cntDias: 0 }
    };

    const estadoConfig = estadoDiasMap[this.selectedEstado?.id || 0] || { idEstadoSeguimiento: 0, cntDias: 0 };
    this.idEstadoSeguimiento = estadoConfig.idEstadoSeguimiento;
    this.cntDias = estadoConfig.cntDias;
  }

  guardar() {
    this.saving = true;
    this.seguimiento = {
      nnaId: this.nna.id,
      fechaSeguimiento: this.seguimiento.fechaSeguimiento,
      estadoId: this.idEstadoSeguimiento,
      contactoNNAId: this.contacto.id,
      telefono: this.contacto.telefonos,
      usuarioId: User.id ?? "",
      solicitanteId: 1,
      fechaSolicitud: new Date(),
      tieneDiagnosticos: this.nna.diagnosticoId > 0,
      observacionesSolicitante: '',
      observacionAgente: this.seguimiento.observacionAgente,
      ultimaActuacionAsunto: '',
      ultimaActuacionFecha: new Date(),
      nombreRechazo: '',
      parentescoRechazo: '',
      razonesRechazo: '',
      alertas: this.alertas.map(alerta => alerta.idSubcategoriaAlerta as number),
      alertasPendientes: this.alertasPendientes
    };

    // let alertasGestionadas = this.alertasPendientes.filter(alerta => alerta.resuelta != true);
    // if (alertasGestionadas.length > 0) {
    //   alertasGestionadas.forEach(alerta => {
    //     if (!this.seguimiento.alertas.includes(alerta.idAlerta as number)) {
    //       this.seguimiento.alertas.push(alerta.idAlerta as number);
    //     }
    //   });
    // }

    console.log('Datos del seguimiento:', this.seguimiento);
    this.showDialog = true;
    this.saving = false;
  }

  getBadgeColor(estadoAlerta: number): string {
    switch (estadoAlerta) {
      case 4: // Resuelta
        return ' '; // Verde
      case 1 || 2:
        return 'bg-warning'; // Amarillo
      case 3:
        return 'bg-danger'; // Rojo
      case 5:
        return 'bg-danger'; // Gris
      default:
        return 'bg-secondary'; // Por defecto
    }
  }

  closeModal(){
    this.showDialog = false;
  }
}
