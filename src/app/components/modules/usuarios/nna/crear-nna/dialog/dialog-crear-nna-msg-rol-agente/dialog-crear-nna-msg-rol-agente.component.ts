import { Component, Input } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TpParametros } from '../../../../../../../core/services/tpParametros';
import { Generico } from '../../../../../../../core/services/generico';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogNnaMsgSeguimientoComponent } from "../../../../../dialog-nna-msg-seguimiento/dialog-nna-msg-seguimiento.component";
import { environment } from '../../../../../../../../environments/environment';

@Component({
  selector: 'app-dialog-crear-nna-msg-rol-agente',
  standalone: true,
  imports: [DialogModule, CommonModule, ButtonModule, FormsModule, DialogNnaMsgSeguimientoComponent],
  templateUrl: './dialog-crear-nna-msg-rol-agente.component.html',
  styleUrls: ['../../../../general.component.css', './dialog-crear-nna-msg-rol-agente.component.css']
})
export class DialogCrearNnaMsgRolAgenteComponent {
  @Input() visible: boolean = false; // Recibir datos del padre
  @Input() nnaId: any; // Recibir datos del padre
  @Input() agenteId: any;
  @Input() coordinadorId: any;
  @Input() contactoNNAId: any;

  rolId = sessionStorage.getItem('roleId');
  visibleDialogSeguimiento: boolean = false;

  formFecha: any;
  formHora: any;
  formMinuto: any;
  formAmPm: any;

  constructor(private router: Router, private fb: FormBuilder, private tpParametros: TpParametros, private axios: Generico) { }

  onSeguimiento() {
    this.visibleDialogSeguimiento = true;
    this.visible = false;
  }

  async onIniciarSeguimiento() {
    this.visible = false;
    await this.guardar();
    this.router.navigate(["/gestion/iniciar_seguimiento"]);
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
    console.log(this.formFecha, this.formHora, this.formMinuto, this.formAmPm, this.axios.isEmpty(this.formFecha) || this.axios.isEmpty(this.agenteId) || Object.keys(this.formHora).length > 0 || Object.keys(this.formMinuto).length > 0 || this.axios.isEmpty(this.formAmPm));
    const now = new Date();


    //Proceso de guardado
    this.cargarHoy();
    var fechaSeguimiento = this.convertirFormato12a24(this.formFecha, this.formHora, this.formMinuto, this.formAmPm);
    console.log("fechaSeguimiento:", fechaSeguimiento);
    var dataRow = {
      "idNNA": this.nnaId,
      "fechaSeguimiento": fechaSeguimiento,
      "idEstado": 1,
      "idContactoNNA": this.contactoNNAId,
      "telefono": " ",
      "idUsuario": this.agenteId,
      "idSolicitante": this.agenteId,
      "observacionSolicitante": "Agendamiento inicial",
      "idUsuarioCreacion": this.agenteId
    };
    var urlbase: string = environment.url_MSSeguimiento;
    var url_path = "Seguimiento/SetSeguimiento";
    var data = await this.axios.retorno_post(url_path, dataRow, true, urlbase);
    alert(data);
    this.router.navigate(["/usuarios/historico_nna"]);

  }
}
