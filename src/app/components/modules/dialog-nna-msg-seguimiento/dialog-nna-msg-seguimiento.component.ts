import { Component, EventEmitter, Input, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TpParametros } from '../../../core/services/tpParametros';
import { Generico } from '../../../core/services/generico';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { CalendarModule } from 'primeng/calendar';
import { Parametricas } from '../../../models/parametricas.model';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { Seguimiento } from '../../../models/seguimiento.model';
import { SeguimientoGestion } from '../../../models/seguimientoGestion.model';
import { ContactoNNA } from '../../../models/contactoNNA.model';
import { apis } from '../../../models/apis.model';
import { GenericService } from '../../../services/generic.services';

@Component({
  selector: 'app-dialog-nna-msg-seguimiento',
  standalone: true,
  imports: [DialogModule, CommonModule, ButtonModule, FormsModule, CalendarModule, DropdownModule, InputTextModule],
  templateUrl: './dialog-nna-msg-seguimiento.component.html',
  styleUrls: ['./dialog-nna-msg-seguimiento.component.css'],
  encapsulation: ViewEncapsulation.Emulated // Esto es por defecto
})
export class DialogNnaMsgSeguimientoComponent {
  @Input() visible: boolean = false; // Recibir datos del padre
  @Input() nnaId: any; // Recibir datos del padre
  @Input() agenteId: any;
  @Input() coordinadorId: any;
  @Input() contactoNNAId: any;
  @Output() dataToParent: any = new EventEmitter<any>();

  rolId = sessionStorage.getItem('roleId');
  formAgenteSeguimiento: any;

  buttonAm: any = 'fondo-color-cancelar';
  buttonPm: any = 'fondo-color-cancelar';
  buttonHoy: any = 'fondo-color-cancelar';
  buttonManana: any = 'fondo-color-cancelar';

  msg: any = '';
  userId = '';

  public agenteAsignadoListado: any[] = [];
  rolIdGeneral = sessionStorage.getItem('roleId');

  minDate: Date | undefined;
  mostrarMensaje: boolean = false;
  submitted: boolean = false;
  hora: number | null = null;     // Horas
  minutos: number | null = null;  // Minutos
  periodo: string = 'AM';         // AM o PM
  tiempo: string = 'Hoy';         // Hoy o Mañana 
  fecha: Date = new Date(); // Fecha actual
  saving: boolean = false; // Bandera para indicar si se está guardando

  seguimiento: SeguimientoGestion = {
    id: 0,
    nnaId: 0,
    fechaSeguimiento: new Date(),
    estadoId: 0,
    contactoNNAId: 0,
    telefono: '',
    usuarioId: this.userId,
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
    alertasPendientes: [],
  }

  constructor(
    private router: Router,
    private tpParametros: TpParametros,
    public gs: GenericService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['nnaId']) {
      this.nnaId = changes['nnaId'].currentValue; // Actualiza el ID si cambia
    }
  }

  async ngOnInit() {
    this.minDate = new Date();
    this.agenteAsignadoListado = await this.tpParametros.getAgentesExistentesAsignados() ?? [];
    console.log("this.agenteAsignadoListado ::", this.agenteAsignadoListado);

    this.formAgenteSeguimiento = this.agenteId > 0 ? this.agenteId : this.coordinadorId;


    if (this.rolIdGeneral == "14CDDEA5-FA06-4331-8359-036E101C5046") {//Agente de seguimiento
      this.formAgenteSeguimiento = sessionStorage.getItem('userId');
    }

    if (this.rolIdGeneral == "311882D4-EAD0-4B0B-9C5D-4A434D49D16D") {//Coordinador
      this.formAgenteSeguimiento = null;
    }
  }

  cargarHoy() {
    this.fecha = new Date();
  }

  cargarManana() {
    this.fecha = new Date();
    this.fecha.setDate(this.fecha.getDate() + 1); // Sumar un día
  }

  validarFecha() {
    //si la fecha es diferente a hoy se debe asignar tiempo en empty
    if (this.fecha.getDate() != new Date().getDate() || this.fecha.getMonth() != new Date().getMonth()) {
      this.tiempo = "empty";
    }
  }

  async guardar() {
    this.submitted = true;
    if (this.validarCamposRequeridos() && !this.saving) {
      this.saving = true;
      this.gs.post('Seguimiento/SetSeguimiento', this.seguimiento, apis.seguimiento).subscribe(
        response => {
          this.mostrarMensaje = true;
          console.log('Archivo subido exitosamente');
        },
        error => {
          console.error('Error al subir el archivo', error);
        }
      );
    }
    this.saving = false;
  }

  validarCamposRequeridos(): boolean {
    this.seguimiento.nnaId = this.nnaId;
    this.seguimiento.usuarioId = this.formAgenteSeguimiento?.id ?? 0;
    this.getFechaYHoraCompleta();

    let camposAValidar: (string | number | Date)[] = [];

    camposAValidar = [
      this.seguimiento.usuarioId,
      this.seguimiento.fechaSeguimiento,
    ];

    // Valida que cada campo no sea nulo, vacío o solo espacios en blanco
    let pos = 0;
    for (const campo of camposAValidar) {
      pos++;
      if (!campo || campo.toString().trim() === '' || campo.toString() === '0') {
        console.log('Campo requerido vacío:', campo);
        console.log('Posición:', pos);
        return false;
      }
    }

    return true;
  }

  isEmpty(value: any): boolean {
    return value === null || value === undefined || value === '';
  }

  getFechaYHoraCompleta(): void {
    if (this.hora !== null && this.minutos !== null) {
      let fechaConHora = new Date(this.fecha);
      fechaConHora.setHours(this.periodo === 'PM' ? this.hora + 12 : this.hora);
      fechaConHora.setMinutes(this.minutos);
      this.seguimiento.fechaSeguimiento = fechaConHora;
    } else {
      console.log('Datos incompletos para fecha y hora');
    }
  }

  apply(p: string) {
    this.periodo = p;
    this.getFechaYHoraCompleta();
  }

  applyFecha(p: string) {
    //p = Hoy o Mañana
    this.tiempo = p;
    if (p == "Hoy") {
      this.cargarHoy();
    }
    if (p == "Mañana") {
      this.cargarManana();
    }
  }

  terminar(){
    this.router.navigate([`/gestion/seguimientos`]).then(() => {
      window.scrollTo(0, 0);
    });
  }
}
