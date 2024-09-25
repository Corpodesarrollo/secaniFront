import { Component, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DragDropModule } from 'primeng/dragdrop';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import esLocale from '@fullcalendar/core/locales/es';
import { CardModule } from 'primeng/card';

import { Calendar } from '@fullcalendar/core';
import { MiSemanaService } from './mi-semana.services';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { IntentoComponent } from '../intento-seguimiento/intento/intento.component';
import { TpParametros } from '../../../../core/services/tpParametros';
import { BotonNotificacionComponent } from '../../boton-notificacion/boton-notificacion.component';

@Component({
  selector: 'app-mi-semana',
  templateUrl: './mi-semana.component.html',
  styleUrls: ['./mi-semana.component.css'],
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule,
    FullCalendarModule, DragDropModule, CardModule, DialogModule, ButtonModule, DropdownModule, InputTextareaModule, IntentoComponent, BotonNotificacionComponent]
})
export class MiSemanaComponent {
  @ViewChild('calendar')
  calendarComponent!: FullCalendarComponent;
  events: any[] = [];
  businessHours: any[] = [];

  holidays: string[] = []; // Lista de días feriados

  selectedDate: Date | undefined;
  esLocale: any;

  calendarOptions: any = {};
  currentDate: Date = new Date();
  calendarApi: Calendar | undefined;

  usuarioId: string = '';
  fechaInicial: any;
  fechaFinal: any;

  displayModal: boolean = false;
  headerDialog: string = '';
  bodyDialog: string = '';
  headerDialogReasignar: string = '';
  displayModal2: boolean = false;
  bodyDialog2: string = '';
  infoEvent: any;
  displayModal3: boolean = false;

  form!: FormGroup;
  agentes: any;


  //agenteSeleccionado: any;

  constructor(public servicios: MiSemanaService,  private fb: FormBuilder) {



    this.esLocale = {
      firstDayOfWeek: 1,
      dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
      dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
      dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
      monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
      monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
      today: 'Hoy',
      clear: 'Claro'
    };


    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'timeGridWeek',
      headerToolbar: {
        left: 'prev',
        center: 'title',
        right: 'next'
      },
      events: this.events,
      locale: esLocale,
      businessHours: this.businessHours,
      slotMinTime: '07:00:00',
      slotMaxTime: '18:00:00',
      hiddenDays: [0, 6],   // Ocultar el sabado y domingo
      allDaySlot: false,
      height: 1750, // Establece la altura del calendario
      editable: true, // Permite arrastrar y soltar
      droppable: true, // Permite soltar eventos externos
      eventConstraint: 'businessHours',
      eventAllow: this.isEventAllowed.bind(this),

      customButtons: {
        prev: {
          text: 'prev',
          click: this.handlePrev.bind(this)
        },
        next: {
          text: 'next',
          click: this.handleNext.bind(this)
        }
      },
      eventDrop: this.handleEventDrop.bind(this),
      eventContent: this.renderEventContent.bind(this),
      eventClick: this.handleEventClick.bind(this)
    };
  }


  async  ngOnInit(){
    this.form = this.fb.group({
      agenteSeleccionado: [null, Validators.required],
      motivo: ['', Validators.required],

    });
    /*
    Reglas
    1. Cargar los datos del seguimiento
    2. Cargar los datos del perfil de horario del usuario, mezclar con los festivos
    */

    // TODO: Determinar id del usuario
    //let usuarioId = sessionStorage.getItem('usuarioId');
    this.usuarioId = '48e6efab-2c8a-4d37-bc6c-d62ec8fdd0c5';

    this.diasLimite(this.currentDate);
    await this.horarioLaboral();
    await this.eventos();


  }

  diasLimite(currentDate: Date) {


    const currentWeekday = currentDate.getDay(); // Obtiene el día de la semana actual (0 = domingo, 1 = lunes, ..., 6 = sábado)

    let f1 = new Date(currentDate);
    let f2 = new Date(currentDate);

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses de 0 a 11
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }


    f1.setDate(currentDate.getDate() - currentWeekday + 1);
    f2.setDate(currentDate.getDate() - currentWeekday + 5);

    this.fechaInicial = formatDate(f1)+' 00:00:00';
    this.fechaFinal = formatDate(f2)+' 23:59:59';
  }


  async horarioLaboral(){

    this.calendarOptions.businessHours = '';

    let festivos = await this.servicios.GetFestivos(this.fechaInicial, this.fechaFinal, this.usuarioId);
    //console.log("==> ",festivos)
    //console.log("festivos", festivos)
    let horarioLaboral = await this.servicios.GetHorarioLaboral(this.usuarioId);

    const listaDias = this.generarDiasSemana(this.fechaInicial, this.fechaFinal);

    // Convertir las fechas festivas a un conjunto para una búsqueda rápida
    const festivosSet = new Set((festivos ?? []).map((festivo: { festivo: string }) => festivo.festivo));


    // Transformación de la respuesta
    let horario = horarioLaboral.map((item: { dia: any; horaEntrada: string; horaSalida: string }) => {

      let isFestivo: any
      // Verificar si la fecha es festiva
      if(festivos != null)
         isFestivo = festivosSet.has(listaDias[item.dia]);

      // Ajustar startTime y endTime si es festivo
      return {
        daysOfWeek: [item.dia],
        startTime: isFestivo ? '07:00:00' : item.horaEntrada,
        endTime: isFestivo ? '07:00:00' : item.horaSalida
      };
    });


    this.calendarOptions.businessHours = horario;
  }


  generarDiasSemana(fechaInicial: Date, fechaFinal: Date): { [key: number]: Date } {
    const diasSemana: { [key: number]: Date } = {}; // Objeto donde el índice es el día de la semana

    // Iterar desde la fecha inicial hasta la fecha final
    let fechaActual = new Date(fechaInicial);

    while (fechaActual <= fechaFinal) {
      const diaSemana = fechaActual.getDay() === 0 ? 7 : fechaActual.getDay(); // Lunes = 1, Domingo = 7

      // Asignar la fecha al día de la semana correspondiente
      diasSemana[diaSemana] = new Date(fechaActual);

      // Avanzar al siguiente día
      fechaActual.setDate(fechaActual.getDate() + 1);
    }

    return diasSemana;
  }


  async eventos(){


    let eventosBD = await this.servicios.GetSeguimientoUsuario(this.usuarioId, this.fechaInicial, this.fechaFinal);
    console.log("eventosBD", eventosBD, this.usuarioId, this.fechaInicial, this.fechaFinal)

    // Función para sumar 30 minutos a una fecha
    let addMinutes = (date: Date, minutes: number): Date => {
      return new Date(date.getTime() + minutes * 60000);
    };

    this.events = eventosBD.map((item: { primerNombre: any; segundoNombre: any; primerApellido: any; segundoApellido: any; fechaSeguimiento: string | number | Date; cantidadAlertas: any; fechaNotificacionSIVIGILA: any; id: any; }) => {
      // Concatenar nombres y apellidos
      //let title = `${item.primerNombre} ${item.segundoNombre} ${item.primerApellido} ${item.segundoApellido}`.trim();
      let title = `${item.primerNombre} ${item.primerApellido}`.trim();

      // Fecha de seguimiento como start
      let start = new Date(item.fechaSeguimiento);

      // Sumar 30 minutos a la fecha de seguimiento para el end
      let end = addMinutes(start, 30);

      let cantidadAlertas = item.cantidadAlertas;
      let fechaNotificacionSIVIGILA = item.fechaNotificacionSIVIGILA;

      return {
        id: item.id,
        title: title,
        start: start, // .toISOString()
        end: end,
        cantidadAlertas: cantidadAlertas,
        fechaNotificacionSIVIGILA: fechaNotificacionSIVIGILA,
      };
    });

    /*this.events =  [  { id: 1, title: 'Ramona Soler', start: '2024-07-23T10:00:00', end: '2024-07-23T10:30:00' },
      { id: 2, title: 'Evento 2', start: '2024-07-24T14:00:00', end: '2024-07-24T14:30:00' },
    ]*/
    //console.log("this.events", this.events);
    this.calendarOptions.events = this.events;
  }

  control = 2;
  handlePrev() {
    if(this.control > 1){
      const currentDate = new Date(this.currentDate);
      const oneWeekAhead = new Date(currentDate.setDate(currentDate.getDate() - 7));
      this.currentDate = this.adjustToWeekStart(oneWeekAhead);

      if (this.calendarComponent) {
        const calendarApi = this.calendarComponent.getApi();
        calendarApi.gotoDate(this.currentDate);
      } else {
        console.error('Calendar component is not initialized');
      }
      this.diasLimite(this.currentDate);
      this.horarioLaboral();
      this.eventos();
      this.control--;
    }
  }

  handleNext() {
    if(this.control < 3){
      const currentDate = new Date(this.currentDate);
      const oneWeekAhead = new Date(currentDate.setDate(currentDate.getDate() + 7));
      this.currentDate = this.adjustToWeekStart(oneWeekAhead);

      if (this.calendarComponent) {
        const calendarApi = this.calendarComponent.getApi();
        calendarApi.gotoDate(this.currentDate);
      } else {
        console.error('Calendar component is not initialized');
      }
      this.diasLimite(this.currentDate);
      this.horarioLaboral();
      this.eventos();
      this.control++;
    //console.log(this.currentDate);
    }

  }

  adjustToWeekStart(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);

    //console.log('la fechaaa '+diff);

    return new Date(date.setDate(diff));
  }


  async handleEventDrop(info: any) {
    const event = info.event;

    let data = {
      "Id": event.id,
      "FechaSeguimiento": this.formatDateTimeForSQLServer(event.start)
    }

    let respuesta = await this.servicios.PutActualizarSeguimiento(data);
    //console.log("respuesta ", respuesta);
  }

  formatDateTimeForSQLServer(dateString: string): string {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses de 0 a 11
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  isEventAllowed(dropInfo: any) {
    const date = dropInfo.startStr.split('T')[0]; // Obtiene la parte de la fecha sin la hora
    const now = new Date();
    const eventStart = new Date(dropInfo.startStr);

    // Verifica si la fecha es un feriado o es anterior a la fecha y hora actual
    if (this.holidays.includes(date) || eventStart < now) {
      return false;
    }

    return true;
  }


  renderEventContent(eventInfo: any) {
    const eventTime = new Date(eventInfo.event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return { html: `<div class="fc-event-custom"><b>${eventInfo.event.title}</b><br>Hora Sugerida: ${eventTime}</div>` };
  }

  handleEventClick(info: any) {
    const event = info.event;
    this.infoEvent = event;
    //console.log(`Evento ID: ${event.id}, Nueva Fecha y Hora: ${event.start}`);
    this.displayModal = true;
    this.headerDialog = "Seguimiento "+this.formatDate(event.start);
    let fechaTemp = event.extendedProps.fechaNotificacionSIVIGILA.slice(0, 23) + 'Z';
    let fechaSivigila = this.formatDate(new Date(fechaTemp));
    //console.log(fechaSivigila, event.extendedProps.fechaNotificacionSIVIGILA)
    this.bodyDialog = "<p>"+event.title+"<br>Seguimiento No. "+event.id+"<br>Alertas Detectadas: "+event.extendedProps.cantidadAlertas+"<br>Reportado por SIVIGILA el "+fechaSivigila+"</p>"

  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    return new Intl.DateTimeFormat('es-ES', options).format(date);
  }

  async reasignar(){

    this.agentes = await this.servicios.GetSeguimientoAgentes(this.usuarioId);
    //console.log(this.agentes);

    this.bodyDialog2 = "<p>"+this.infoEvent.title+"<br>Seguimiento No. "+this.infoEvent.id;
    this.displayModal = false;
    this.displayModal2 = true;
    this.form.reset();
    //console.log(this.infoEvent)



  }

  async guardar(){
    if (this.form.valid) {
      console.log(this.form.value);

      let data = {
        id: this.infoEvent.id,
        usuarioId: this.form.value.agenteSeleccionado.id,
        observacionesSolicitante: this.form.value.motivo
      }

       let respuesta = await this.servicios.PutSeguimientoActualizacionUsuario(data);
      //let respuesta = 1;

      if( respuesta == 1 ){
        this.displayModal2 = false;
        this.displayModal3 = true;

        this.form.reset();

        this.ngOnInit();
      }
      else {
        alert("No es posible reasignar seguimientos en horarios vencidos");
      }     // Lógica de guardado
    } else {
      console.log('Formulario inválido');
    }
  }

  cerrarDialog(){
    this.displayModal2 = false;
  }




}
