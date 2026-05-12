import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TablasParametricas } from '../../../../core/services/tablasParametricas';
import { TpParametros } from '../../../../core/services/tpParametros';
import { NNA } from '../../../../models/nna.model';
import { Parametricas } from '../../../../models/parametricas.model';
import { Seguimiento } from '../../../../models/seguimiento.model';
import { SeguimientoCntFiltros } from '../../../../models/seguimientoCntFiltros.model';
import { GenericService } from '../../../../services/generic.services';
import { BotonNotificacionComponent } from '../../boton-notificacion/boton-notificacion.component';
import { ButtonModule } from 'primeng/button';
import { SeguimientoStepsComponent } from "../seguimientos/seguimiento-steps/seguimiento-steps.component";
import { StepsModule } from 'primeng/steps';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { PersonaService } from '../../../../core/services/personaService';
import { Persona } from '../../../../models/persona.model';
import { NNAService } from '../../../../core/services/nnaService';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { User } from '../../../../core/services/user';
import { environment } from '../../../../../environments/environment';
import { ReportesSIVIGILA } from '../../../../models/reporteSIVIGILA.model';

@Component({
  selector: 'app-estado-seguimiento',
  standalone: true,
  imports: [TableModule, BadgeModule, CardModule, CommonModule, StepsModule, RouterModule, DialogModule, ButtonModule, SeguimientoStepsComponent, DropdownModule, InputTextModule, FormsModule, ReactiveFormsModule, ToastModule, SpinnerComponent],
  templateUrl: './estado-seguimiento.component.html',
  styleUrl: './estado-seguimiento.component.css',
  providers: [MessageService]
})
export class EstadoSeguimientoComponent implements OnInit {
  cargado = false;
  xUser = new User();
  nna: NNA = new NNA();
  idUsuario: string = "48e6efab-2c8a-4d37-bc6c-d62ec8fdd0c5";
  // idUsuario?: string;
  cntFiltros: SeguimientoCntFiltros = {
    hoy: 0,
    conAlerta: 0,
    todos: 0,
    solicitadosPorCuidador: 0
  };
  seguimientos: Seguimiento[] = [];
  data: Seguimiento | undefined;
  mensajeCarga: string = 'Cargando datos...';
  colorMensaje: string = 'text-primary';
  activeFilter: string = '1';
  show: boolean = false;
  persona: boolean = false;
  isLoading = false;
  mostrarMensaje: boolean = false;

  itemsStep = [
    { label: 'Solicitado', date: '12/06/2024' },
    { label: 'Agente asignado', date: '12/06/2024' },
    { label: 'Agendado', date: '12/06/2024' },
    { label: 'Contactado', date: '12/06/2024' },
  ];

  activeIndex = 0;

  isLoadingTipoID: boolean = true;
  isLoadingParentesco: boolean = true;

  parentescos: Parametricas[] = [];
  tipoID: Parametricas[] = [];

  selectedTipoID: Parametricas | undefined;
  selectedParentesco: Parametricas | undefined;
  selectedRecaidad: Parametricas | undefined;

  public visible: boolean = false;
  public estaFallecido: boolean = false; // Controla el diálogo de mensaje de fallecimiento
  public hayRecaida: boolean = false;
  public esMenorEdad: boolean = true;
  public estaRegistrado: boolean = true;
  public submitted: boolean = false;
  public validating: boolean = false;
  public firstLoad: boolean = false;
  public edad: number = 0;

  public nnaInfo: { nombre: string, identificacion: string } = { nombre: '', identificacion: '' };
  //recaidadOpciones: 1 - Si, 2 -no
  public recaidaOpciones: Parametricas[] = [
    { id: 1, nombre: 'Sí' },
    { id: 2, nombre: 'No' }
  ];

  constructor(
      private messageService: MessageService,
      private router: Router,
      private repos: GenericService,
      private tp: TablasParametricas,
      private tpp: TpParametros,
      private personaService: PersonaService,
      private nnaService: NNAService,
    ) {
  }
  
  async ngOnInit(): Promise<void> {
    if (this.xUser.id != null) {
      this.idUsuario = this.xUser.id;

      // BUG-LZ-024: try/finally para que el loading no quede colgado si la TP falla (deja el modal con spinner perpetuo)
      try {
        this.tipoID = await this.tp.getTP('APSTipoIdentificacion');
      } catch (e) {
        console.error('Error cargando tipos identificacion', e);
        this.tipoID = [];
      } finally {
        this.isLoadingTipoID = false;
      }

      try {
        this.parentescos = await this.tpp.getParentescos();
      } catch (e) {
        console.error('Error cargando parentescos', e);
        this.parentescos = [];
      } finally {
        this.isLoadingParentesco = false;
      }

      this.CargarDatos(this.xUser.id);
    } else{
      window.location.href = environment.url_Sispro;
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const highlightedStep = document.querySelector('.p-steps-item.p-highlight');
      if (highlightedStep) {
        highlightedStep.classList.remove('p-highlight');
      }
    });
  }

  CargarDatos(filter: string) {
    if (this.xUser.isCuidador) {
      this.repos.get('Seguimiento/GetSeguimientosCuidador/', `${filter}`, 'Seguimiento').subscribe({
        next: (data: any) => {
          this.seguimientos = data;
          this.cargado = true;
        },
        error: (err) => {
          this.cargado = true;
          console.error(err);
        }
      });
    } else{
      this.repos.get('Seguimiento/GetSeguimientosEstados/', `${filter}`, 'Seguimiento').subscribe({
        next: (data: any) => {
          this.seguimientos = data;
          this.cargado = true;
        },
        error: (err) => {
          this.cargado = true;
          console.error(err);
        }
      });
    }
  }

  consultarSeguimiento(data: Seguimiento) {
    this.isLoading = true;
    this.data = data;

    // BUG-LZ-025: solo avanzar el paso si la fecha realmente ya ocurrió.
    // Antes el activeIndex usaba fechas futuras (Asignado/Contactado) marcando pasos no completados.
    const ahora = new Date();
    if (this.data.fechaUltimaActuacion != null && new Date(this.data.fechaUltimaActuacion) <= ahora) {
      this.activeIndex = 3;
    } else if (this.data.fechaSeguimiento != null) {
      // Agendado (fechaSeguimiento) puede ser futuro por diseño (programación)
      this.activeIndex = 2;
    } else if (this.data.fechaAsignacion != null && new Date(this.data.fechaAsignacion) <= ahora) {
      this.activeIndex = 1;
    } else if (this.data.fechaSolicitud != null) {
      this.activeIndex = 0;
    }

    this.show = true;
    this.isLoading = false;
  }

  // BUG-LZ-025: helper para template - oculta fechas futuras en pasos que ya deberían haber ocurrido
  esFechaPasada(fecha: any): boolean {
    if (!fecha) return false;
    return new Date(fecha) <= new Date();
  }

  showDialog(): void {
    this.nna = new NNA();
    this.selectedParentesco = undefined;
    this.selectedTipoID = undefined;
    this.submitted = false;
    this.visible = true;
    this.estaFallecido = false;
    this.esMenorEdad = true;
    this.hayRecaida = false;
    this.estaRegistrado = true;
    this.firstLoad = true;
  }

  hiddenDialog(): void {
    this.visible = false;
    this.mostrarMensaje = false;
    this.estaRegistrado = true;
  }

  closeInformacionDialog() {
    this.visible = true;
    this.estaRegistrado = true;
  }

  async onSubmitSeguimiento(): Promise<void> {
    if(this.validating){
      return;
    }

    this.submitted = true;
    this.validating = true;
    // BUG-LZ-024: try/finally garantiza que validating se resetee aunque buscar() lance
    try {
      if (this.validarCamposRequeridos()){
        await this.buscar();
      }
    } catch (e) {
      console.error('Error en onSubmitSeguimiento', e);
    } finally {
      this.validating = false;
    }
  }

  validarCamposRequeridos(): boolean {
    this.nna.tipoIdentificacionId = this.selectedTipoID?.codigo ?? '';
    this.nna.cuidadorParentescoId = this.selectedParentesco?.id ?? 0;

    const camposAValidar = [
      this.nna.numeroIdentificacion,
      this.nna.tipoIdentificacionId,
      this.nna.cuidadorParentescoId
    ];

    // Valida que cada campo no sea nulo, vacío o solo espacios en blanco
    let pos = 0;
    for (const campo of camposAValidar) {
      pos++;
      if (!campo || campo.toString().trim() === '' || campo === '0') {
        console.log('Campo requerido vacío', pos);
        return false;
      }
    }

    return true;
  }
  
  async buscar() {
    this.validating = true;
    this.hayRecaida = false;
    this.esMenorEdad = true;
    this.estaFallecido = false;
    this.estaRegistrado = true;
    
    let nna : NNA | null = await this.nnaService.getByIdentificacion(this.nna.tipoIdentificacionId, this.nna.numeroIdentificacion);
    if (nna) {
      this.nnaInfo.nombre = nna.primerNombre + ' ' + nna.segundoNombre + ' ' + nna.primerApellido + ' ' + nna.segundoApellido;
      this.nnaInfo.identificacion = this.nna.numeroIdentificacion;
      console.log("Esta en secani: ", true);
      console.log("nna: ", nna);
      if (nna.estadoId == 9 || nna.estadoId == 12) {
        this.hayRecaida = true;
      } else if (nna.estadoId == 10) {
        this.estaFallecido = true;
      } else if (nna.estadoId == 11) {
        this.esMenorEdad = false;
      } else {
        await this.crearSeguimiento();
      }
    } else {
      let persona : Persona | null = await this.personaService.get(this.nna.tipoIdentificacionId, this.nna.numeroIdentificacion);
      if (persona) {
        persona.primer_nombre = persona.primer_nombre ?? '';
        persona.segundo_nombre = persona.segundo_nombre ?? '';
        persona.primer_apellido = persona.primer_apellido ?? '';
        persona.segundo_apellido = persona.segundo_apellido ?? '';

        this.nnaInfo.nombre = persona.primer_nombre + ' ' + persona.segundo_nombre + ' ' + persona.primer_apellido + ' ' + persona.segundo_apellido;
        this.nnaInfo.identificacion = this.nna.numeroIdentificacion;
        this.persona = true;
        this.estaRegistrado = false;
      } else {
        this.persona = false;
        this.estaRegistrado = false;
        console.log("No se encontró la persona con el número de identificación proporcionado.");
      }
    }
    this.firstLoad = false;
    this.validating = false;
  }

  async onSubmitRecaida(): Promise<void> {
     if (!this.selectedRecaidad) return;
    await this.crearSeguimiento();
  }

  continuar() {
    this.router.navigate([`/cuidador/seguimientos/nuevo`], {
      state: { tipoId: this.selectedTipoID?.codigo, numero: this.nna.numeroIdentificacion, parentescoId: this.selectedParentesco?.codigo }
    }).then(() => {
      window.scrollTo(0, 0);
    });
  }

  async crearSeguimiento(): Promise<any> {
    let reporte = {
      tipoIdentificacion: this.nna.tipoIdentificacionId,
      numeroIdentificacion: this.nna.numeroIdentificacion,
    };
    return new Promise((resolve, reject) => {
        this.repos.post('ReportesSIVIGILA/CrearSeguimiento', reporte, 'NNA').subscribe({
            next: (data: any) => {
              console.log('Respuesta del servidor:', data);
              this.mostrarMensaje = true;
              resolve(data);
            },
            error: (err) => {
              console.error(err);
              reject(err);
            }
        });
    });
  }
}
