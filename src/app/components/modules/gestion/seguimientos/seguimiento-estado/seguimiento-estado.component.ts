import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SeguimientoStepsComponent } from '../seguimiento-steps/seguimiento-steps.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { TablasParametricas } from '../../../../../core/services/tablasParametricas';
import { Parametricas } from '../../../../../models/parametricas.model';
import { TpParametros } from '../../../../../core/services/tpParametros';
import { InfoDiagnostico } from '../../../../../models/infoDiagnostico.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SeguimientoAlertasComponent } from "../../seguimiento-alertas/seguimiento-alertas.component";
import { AlertasTratamiento } from '../../../../../models/alertasTratamiento.model';
import { NNA } from '../../../../../models/nna.model';
import { GenericService } from '../../../../../services/generic.services';
import { NNAService } from '../../../../../core/services/nnaService';
import { EstadoNnaComponent } from "../../../estado-nna/estado-nna.component";
import { apis } from '../../../../../models/apis.model';
import { SeguimientoGuardarComponent } from "../seguimiento-guardar/seguimiento-guardar.component";
import { SeguimientoGestion } from '../../../../../models/seguimientoGestion.model';
import { AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  selector: 'app-seguimiento-estado',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, CardModule, AutoCompleteModule, SeguimientoStepsComponent, ReactiveFormsModule, DropdownModule, CalendarModule, FormsModule, InputTextModule, SeguimientoAlertasComponent, EstadoNnaComponent, SeguimientoGuardarComponent],
  templateUrl: './seguimiento-estado.component.html',
  styleUrl: './seguimiento-estado.component.css'
})
export class SeguimientoEstadoComponent  implements OnInit {
  nna: NNA = new NNA();
  id: string | undefined;
  saving: boolean = false;
  
  estadosExcluirMap: { [key: string]: string[] } = {
      "Diagnóstico descartado": ["Sin diagnóstico", "Mayor de 18 años"],
      "Sin diagnóstico": ["Mayor de 18 años"],
      "Diagnóstico confirmado": ["Diagnóstico descartado", "Sin diagnóstico", "Mayor de 18 años"],
      "EP Tratamiento en domicilio": ["Diagnóstico descartado", "Sin diagnóstico", "Mayor de 18 años"],
      "EP Ambulatorio": ["Diagnóstico descartado", "Sin diagnóstico", "Mayor de 18 años"],
      "EP Intrahospitalario": ["Diagnóstico descartado", "Sin diagnóstico", "Mayor de 18 años"],
      "EP Trasplante": ["Diagnóstico descartado", "Sin diagnóstico", "Mayor de 18 años"],
      "Valoración por oncología": ["Diagnóstico descartado", "Sin diagnóstico", "Mayor de 18 años"],
      "Tratamiento finalizado": ["Diagnóstico descartado", "Sin diagnóstico", "Mayor de 18 años"],
      "Fallecido": ["Diagnóstico descartado", "Sin diagnóstico", "Diagnóstico confirmado", "EP Tratamiento en domicilio", "EP Ambulatorio", "EP Intrahospitalario", "EP Trasplante", "Valoración por oncología", "Tratamiento finalizado", "Mayor de 18 años", "Sobreviviente", "No contactado", "Pendientes de cierre", "Registrado", "Registro temporal"],
      "Mayor de 18 años": ["Diagnóstico descartado", "Sin diagnóstico", "Diagnóstico confirmado", "EP Tratamiento en domicilio", "EP Ambulatorio", "EP Intrahospitalario", "EP Trasplante", "Valoración por oncología", "Tratamiento finalizado", "Sobreviviente", "No contactado", "Pendientes de cierre", "Registrado", "Registro temporal"],
      "Sobreviviente": ["Diagnóstico descartado", "Sin diagnóstico", "Mayor de 18 años"],
      "No contactado": ["Diagnóstico descartado", "Sin diagnóstico", "Mayor de 18 años"],
      "Pendientes de cierre": ["Diagnóstico descartado", "Sin diagnóstico", "Mayor de 18 años"],
      "Registrado": ["Mayor de 18 años"],
      "Registro temporal": ["Mayor de 18 años"]
    };

  submitted2: boolean = false;
  estado:string = 'Registrado';
  stepsCount: number = 6;
  items: MenuItem[] = [];
  estados: Parametricas[] = [];
  diagnosticos: Parametricas[] = [];
  IPS: Parametricas[] = [];
  razonesSinDiagnostico: Parametricas[] = [];

  selectedDiagnostico: Parametricas | undefined;
  selectedEstado: Parametricas | undefined;
  selectedIPS: Parametricas | undefined;
  selectedRazonSinDiagnostico: Parametricas | undefined;

  isLoadingDiagnostico: boolean = true;
  isLoadingEstados: boolean = true;
  isLoadingIPS: boolean = true;
  isLoadingRazonesSinDiagnostico: boolean = true;

  estadoFallecido: boolean = false;
  estadoEnTratamiento: boolean = false;
  estadoSinTratamiento: boolean = false;
  estadoSinDiagnostico: boolean = false;
  estadoDefault: boolean = false;

  idContacto: string | undefined;

  diagnostico: InfoDiagnostico = {
    id: 0,
    idSeguimiento: 0,
    idEstado: 0,
    tipoDiagnostico: 0,
    fechaConsulta: new Date(),
    IPSActual: 0,
    recaidas: 0,
    numeroRecaidas: 0,
    otrasRazones: "",
    observaciones: "",
    alertas: []
  };
  colorTxt: string = 'white';	
  colorBg: string = '#73b7ad';

  alertas: AlertasTratamiento[] = [];
  cnt: number = 0;

  showGuardarSeguimiento: boolean = false;
  itemsIPS: Parametricas[] = []; 
  filteredItems: Parametricas[] = [];

  constructor(private tpp: TpParametros, private tp: TablasParametricas, private router: Router, private nnaService: NNAService, private routeAct: ActivatedRoute, private gs: GenericService,) {
  }

  async ngOnInit(): Promise<void> {
    this.routeAct.paramMap.subscribe(() => {
      this.idContacto = history.state.idContacto;
    });
    this.id = this.routeAct.snapshot.paramMap.get('id')!;

    this.validarSeguimiento(Number(this.id));

    this.nna = await this.tpp.getNNA(this.id);

    this.items = [
      { label: 'Seguimientos', routerLink: '/gestion/seguimientos' },
      { label: `${this.nna.primerNombre} ${this.nna.primerApellido}`, routerLink: `/gestion/seguimientos/datos-seguimiento/${this.id}` },
    ];

    if (this.nna.fechaConsultaDiagnostico) {
      this.nna.fechaConsultaDiagnostico = new Date(this.nna.fechaConsultaDiagnostico);
    }

    if (this.nna.fechaDiagnostico) {
      this.nna.fechaDiagnostico = new Date(this.nna.fechaDiagnostico);
    }

    if (this.nna.fechaInicioTratamiento) {
      this.nna.fechaInicioTratamiento = new Date(this.nna.fechaInicioTratamiento);
    }
 
    let estadosNNA = await this.tpp.getTpEstadosNNA();
    let estado: { id: number; nombre: string; colorText: string; colorBG: string } | undefined;
    if (estadosNNA) {
      estado = estadosNNA.find((x: { id: number }) => x.id === this.nna.estadoId);
      console.log(estado);
    }
    this.estado = estado?.nombre ?? '';
    this.colorTxt = estado?.colorText ?? 'white';
    this.colorBg = estado?.colorBG ?? '#73b7ad';

    this.estados = await this.tpp.getTpEstadosNNA();
    this.selectedEstado = this.estados.find(x => x.id == this.nna.estadoId);
    this.isLoadingEstados = false;
    await this.onChangeEstado();
    await this.validarEstado();

    this.diagnosticos =  await this.tpp.getDiagnosticos();
    this.selectedDiagnostico = this.diagnosticos.find(x => x.id == this.nna.diagnosticoId);
    this.isLoadingDiagnostico = false;

    this.razonesSinDiagnostico = await this.tpp.getRazonesSinDiagnostico();
    console.log(this.razonesSinDiagnostico);
    this.selectedRazonSinDiagnostico = this.razonesSinDiagnostico.find(x => x.id == this.nna.motivoNoDiagnosticoId);
    this.isLoadingRazonesSinDiagnostico = false;

    this.IPS = await this.tpp.getIPS(this.nna.municipioNacimientoId);
    this.selectedIPS = this.IPS.find(x => x.id == this.nna.ipsId);
    this.isLoadingIPS = false;
  }

  searchItems(event: any) {
    this.gs.getAsync('IPS/Search', `/${event.query}`, apis.tablaParametrica).then((data: any) => {
      this.filteredItems = data;
    }).catch((error: any) => {
      console.error('Error fetching contact list', error);
    });
  }

  validarSeguimiento(id: number) {
    this.gs.getAsync('Seguimiento/GetCntSeguimientoByNNA', `/${id}`, apis.seguimiento).then((data: any) => {
      this.cnt = Number(data);
    }).catch((error: any) => {
      console.error('Error al cargar la lista', error);
    });
  }

  applyRecaida(value: boolean) {
    this.nna.recaida = value;
    if(!value) {
      this.nna.cantidadRecaidas = 0;
    }
  }

  async validarEstado() {
    if (this.selectedEstado?.nombre) {
        const estadosExcluir = this.estadosExcluirMap[this.selectedEstado.nombre];
        this.estados = this.estados.filter(x => x.nombre && !estadosExcluir.includes(x.nombre));
    }
  }

  async onChangeEstado() {
    if(this.selectedEstado?.nombre === "Fallecido") {
      this.estadoFallecido = true;
      this.estadoEnTratamiento = false;
      this.estadoSinTratamiento = false;
      this.estadoSinDiagnostico = false;
      this.estadoDefault = false;
    }
    else if(this.selectedEstado?.nombre === "Registrado") {
      this.stepsCount = 5;
      this.estadoFallecido = false;
      this.estadoEnTratamiento = false;
      this.estadoSinTratamiento = false;
      this.estadoSinDiagnostico = false;
      this.estadoDefault = false;
    }
    else if(
      this.selectedEstado?.nombre === "EP Tratamiento en domicilio" ||
      this.selectedEstado?.nombre === "EP Ambulatorio" ||
      this.selectedEstado?.nombre === "EP Intrahospitalario" ||
      this.selectedEstado?.nombre === "EP Trasplante" ||
      this.selectedEstado?.nombre === "Valoración por oncología"
    ) {
      this.stepsCount = 5;
      this.estadoFallecido = false;
      this.estadoEnTratamiento = true;
      this.estadoSinTratamiento = false;
      this.estadoSinDiagnostico = false;
      this.estadoDefault = false;
    }
    else if(this.selectedEstado?.nombre === "Diagnóstico confirmado") {
      this.estadoFallecido = false;
      this.estadoEnTratamiento = false;
      this.estadoSinTratamiento = true;
      this.estadoSinDiagnostico = false;
      this.estadoDefault = false;
    }
    else if(this.selectedEstado?.nombre === "Sin diagnóstico") {
      this.stepsCount = 3;
      this.estadoFallecido = false;
      this.estadoEnTratamiento = false;
      this.estadoSinTratamiento = false;
      this.estadoSinDiagnostico = true;
      this.estadoDefault = false;
    } else {
      this.estadoDefault = true;
      this.estadoFallecido = false;
      this.estadoEnTratamiento = false;
      this.estadoSinTratamiento = false;
      this.estadoSinDiagnostico = false;
    }

  }

  onAlertasChange(alertas: AlertasTratamiento[]) {    
    this.alertas = alertas; // Guardar la lista emitida por el hijo
  }

  validarCamposRequeridos(): boolean {
    this.nna.diagnosticoId = this.selectedDiagnostico?.id ?? 0;
    this.nna.estadoId = this.selectedEstado?.id ?? 0;

    let camposAValidar: any[] = [];

    if(this.selectedEstado?.nombre === "Sin tratamiento"){
      camposAValidar = [
        this.nna.estadoId,
        this.nna.RazonesSinIniciarTratamiento,
      ];
    } else {
      camposAValidar = [
        this.nna.estadoId
      ];
    }

    // Valida que cada campo no sea nulo, vacío o solo espacios en blanco
    for (const campo of camposAValidar) {
      if (!campo || campo.toString().trim() === '' || campo.toString().trim() === '0') {
        return false;
      }
    }

    return true;
  }

  async Siguiente() {
    this.submitted2 = true;
    this.saving = true;
    if (this.validarCamposRequeridos()){
      await this.Actualizar();
      if(this.estadoDefault) {
        this.router.navigate([`/gestion/seguimientos/gestionar-seguimiento/${this.id}`], {
          state: { alertas: this.alertas, idContacto: this.idContacto, skipGuard: true }
        }).then(() => {
          window.scrollTo(0, 0);
        });
      }else if(this.estadoSinDiagnostico || this.estadoSinTratamiento) {
        this.router.navigate([`/gestion/seguimientos/gestionar-seguimiento/${this.id}`], {
          state: { alertas: this.alertas, idContacto: this.idContacto, skipGuard: true }
        }).then(() => {
          window.scrollTo(0, 0);
        });
      }else if(this.estadoFallecido) {
        this.router.navigate([`/gestion/seguimientos/fallecido-seguimiento/${this.id}`], {
          state: { idContacto: this.idContacto, skipGuard: true }
        }).then(() => {
          window.scrollTo(0, 0);
        });
      }else if(this.estadoEnTratamiento) {
        if (this.cnt > 1) {
          this.router.navigate([`/gestion/seguimientos/gestionar-seguimiento/${this.id}`], {
            state: { alertas: this.alertas, idContacto: this.idContacto, skipGuard: true }
          }).then(() => {
            window.scrollTo(0, 0);
          });
        } else {
          this.router.navigate([`/gestion/seguimientos/traslado-seguimiento/${this.id}`], {
            state: { idContacto: this.idContacto, skipGuard: true }
          }).then(() => {
            window.scrollTo(0, 0);
          });
        }
      }
    }
    this.saving = false;
  }

  async Actualizar() {
    console.log(this.nna);
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
      usuarioId: 'abc',
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
