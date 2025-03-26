import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
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
  formFecha: any;
  formHora: any;
  formMinuto: any;
  formAmPm: any;

  buttonAm: any = 'fondo-color-cancelar';
  buttonPm: any = 'fondo-color-cancelar';
  buttonHoy: any = 'fondo-color-cancelar';
  buttonManana: any = 'fondo-color-cancelar';

  msg: any = '';
  userId = '';

  public agenteAsignadoListado: Parametricas[] = [];
  rolIdGeneral = sessionStorage.getItem('roleId');

  minDate: Date | undefined;
  mostrarMensaje: boolean = false;
  submitted: boolean = false;
  hora: number | null = null;     // Horas
  minutos: number | null = null;  // Minutos
  periodo: string = 'AM';         // AM o PM

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private tpParametros: TpParametros,
    public axios: Generico,
    private datePipe: DatePipe
  ) {

  }

  async ngOnInit() {
    this.minDate = new Date();
    this.agenteAsignadoListado = await this.tpParametros.getAgentesExistentesAsignados() ?? [];
    //console.log("this.agenteAsignadoListado ::", this.agenteAsignadoListado);

    this.formAgenteSeguimiento = this.agenteId > 0 ? this.agenteId : this.coordinadorId;


    if (this.rolIdGeneral == "14CDDEA5-FA06-4331-8359-036E101C5046") {//Agente de seguimiento
      this.formAgenteSeguimiento = sessionStorage.getItem('userId');
    }

    if (this.rolIdGeneral == "311882D4-EAD0-4B0B-9C5D-4A434D49D16D") {//Coordinador
      this.formAgenteSeguimiento = null;
    }


  }

  cargarHoy() {
    const fecha = new Date();


    // Format date as DD/MM/YYYY
    const day = fecha.getDate().toString().padStart(2, '0');
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const year = fecha.getFullYear();

    // Format date as YYYY-MM-DD
    this.formFecha = fecha.toISOString().split('T')[0]; // Extract YYYY-MM-DD
    this.formFecha = fecha; // Extract YYYY-MM-DD

    this.formMinuto = fecha.getMinutes();

    // Format time as 12-hour clock
    let hours = fecha.getHours();
    const minutes = fecha.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12; // Convert to 12-hour format
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    this.formHora = hours;
    this.cargarAmPM(ampm);

    this.buttonHoy = 'fondo-color-principal';
    this.buttonManana = 'fondo-color-cancelar';
    this.msg = "";
  }

  cargarManana() {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 1); // Set to tomorrow

    // Format date as DD/MM/YYYY
    const day = fecha.getDate().toString().padStart(2, '0');
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const year = fecha.getFullYear();

    // Format date as YYYY-MM-DD
    this.formFecha = fecha.toISOString().split('T')[0]; // Extract YYYY-MM-DD}
    // Añadir un día (1000 ms * 60 segundos * 60 minutos * 24 horas)
    this.formFecha = fecha;

    console.log(this.formFecha);
    this.formMinuto = fecha.getMinutes();

    // Format time as 12-hour clock
    let hours = fecha.getHours();
    const minutes = fecha.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12; // Convert to 12-hour format
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    this.formHora = hours;
    this.cargarAmPM(ampm);

    this.buttonHoy = 'fondo-color-cancelar';
    this.buttonManana = 'fondo-color-principal';
    this.msg = "";
  }

  cargarAmPM(ampm: any) {
    this.msg = "";
    this.formAmPm = ampm;
    if (ampm == "AM") {
      this.buttonAm = 'fondo-color-principal';
      this.buttonPm = 'fondo-color-cancelar';
    } else {
      this.buttonPm = 'fondo-color-principal';
      this.buttonAm = 'fondo-color-cancelar';
    }
  }

  convertirFormato12a24(fecha: string, hora: number, minutos: number, amPm: string): string {
    // Combinar fecha y hora
    let hours = hora;
    if (amPm === 'PM' && hours < 12) {
      hours += 12; // Convertir a 24 horas
    } else if (amPm === 'AM' && hours === 12) {
      hours = 0; // Convertir medianoche a 00 horas
    }

    // Formatear horas y minutos con ceros a la izquierda si es necesario
    const hoursFormatted = hours.toString().padStart(2, '0');
    const minutesFormatted = minutos.toString().padStart(2, '0');

    // Devolver la fecha y hora en formato 24 horas
    return `${fecha}T${hoursFormatted}:${minutesFormatted}`;
  }

  async guardar() {
    
    this.mostrarMensaje = true;

    console.log(
      "this.formFecha,", this.formFecha,
      "this.formHora,", this.formHora,
      "this.formMinuto,", this.formMinuto,
      "this.formAmPm", this.formAmPm,
      "this.formAgenteSeguimiento,", this.formAgenteSeguimiento,
      "validacion::",
      this.isEmpty(this.formFecha)
      || (this.isEmpty(this.formAgenteSeguimiento) || this.formAgenteSeguimiento == null)
      || this.isEmpty(this.formHora)
      || this.isEmpty(this.formMinuto)
      || this.isEmpty(this.formAmPm));

    const now = new Date();

    if (this.isEmpty(this.formFecha)
      || (this.isEmpty(this.formAgenteSeguimiento) || this.formAgenteSeguimiento == null)
      || this.isEmpty(this.formHora)
      || this.isEmpty(this.formMinuto)
      || this.isEmpty(this.formAmPm)) {
      this.msg = "Campos requeridos.";
    } else {
      this.msg = "";
      //Proceso de guardado
      var fechaSeguimiento:any = this.convertirFormato12a24(this.formFecha.toISOString().split('T')[0], this.formHora, this.formMinuto, this.formAmPm);
      console.log("**** fechaSeguimiento:", fechaSeguimiento);
      var dataRow = {
        "idNNA": this.nnaId,
        "fechaSeguimiento": fechaSeguimiento,
        "idEstado": 1,
        "idContactoNNA": this.contactoNNAId,
        "telefono": " ",
        "idUsuario": this.userId,
        "idSolicitante": this.formAgenteSeguimiento,
        "observacionSolicitante": "Agendamiento inicial",
        "idUsuarioCreacion": this.userId
      };
      var urlbase: string = environment.url_MSSeguimiento;
      var url_path = "Seguimiento/SetSeguimiento";
      var data = await this.axios.retorno_post(url_path, dataRow, true, urlbase);
      this.dataToParent.emit(dataRow);
      alert(data);
      this.router.navigate(["/usuarios/historico_nna"]);
    }
  }

  isEmpty(value: any): boolean {
    return value === null || value === undefined || value === '';
  }

  ///////////////////////////////
  getFechaYHoraCompleta(): void {
    if (this.hora !== null && this.minutos !== null) {
      let fechaConHora = new Date();
      fechaConHora.setHours(this.periodo === 'PM' ? this.hora + 12 : this.hora);
      fechaConHora.setMinutes(this.minutos);
    } else {
      console.log('Datos incompletos para fecha y hora');
    }
  }

  apply(p: string) {
    this.periodo = p;
    this.getFechaYHoraCompleta();
  }

  terminar(){
    this.router.navigate([`/gestion/seguimientos`]).then(() => {
      window.scrollTo(0, 0);
    });
  }
}
