import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TpParametros } from '../../core/services/tpParametros';
import { Generico } from '../../core/services/generico';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dialog-nna-msg-seguimiento',
  templateUrl: './dialog-nna-msg-seguimiento.component.html',
  styleUrls: ['./dialog-nna-msg-seguimiento.component.css'],
  encapsulation: ViewEncapsulation.Emulated // Esto es por defecto
})
export class DialogNnaMsgSeguimientoComponent {
  @Input() visible: boolean = false; // Recibir datos del padre
  @Input() nnaId: any; // Recibir datos del padre 
  @Input() agenteId: any;
  @Input() coordinadorId: any;

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

  public agenteAsignadoListado: any;

  constructor(private router: Router, private fb: FormBuilder, private tpParametros: TpParametros, public axios: Generico) {

  }

  async ngOnInit() {
    this.agenteAsignadoListado = await this.tpParametros.getAgentesExistentesAsignados() ?? [];
    //console.log("this.agenteAsignadoListado ::", this.agenteAsignadoListado);

    this.formAgenteSeguimiento = this.agenteId;
  }

  cargarHoy() {
    const fecha = new Date();


    // Format date as DD/MM/YYYY
    const day = fecha.getDate().toString().padStart(2, '0');
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const year = fecha.getFullYear();

    // Format date as YYYY-MM-DD
    this.formFecha = fecha.toISOString().split('T')[0]; // Extract YYYY-MM-DD

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
  }

  cargarManana() {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 1); // Set to tomorrow

    // Format date as DD/MM/YYYY
    const day = fecha.getDate().toString().padStart(2, '0');
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const year = fecha.getFullYear();

    // Format date as YYYY-MM-DD
    this.formFecha = fecha.toISOString().split('T')[0]; // Extract YYYY-MM-DD
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
  }

  cargarAmPM(ampm: any) {
    this.formAmPm = ampm;
    if (ampm == "AM") {
      this.buttonAm = 'fondo-color-principal';
      this.buttonPm = 'fondo-color-cancelar';
    } else {
      this.buttonPm = 'fondo-color-principal';
      this.buttonAm = 'fondo-color-cancelar';
    }
  }

  async guardar() {
    if (this.axios.isEmpty(this.formFecha) && this.axios.isEmpty(this.formAgenteSeguimiento) && this.axios.isEmpty(this.formHora) && this.axios.isEmpty(this.formMinuto)) {
      this.msg = "Campos requeridos.";
    } else {
      this.msg = "";
      //Proceso de guardado
    }
  }
}