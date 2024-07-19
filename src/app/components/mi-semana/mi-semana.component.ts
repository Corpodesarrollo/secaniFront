import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DragDropModule } from 'primeng/dragdrop';
import { CommonModule } from '@angular/common';
import esLocale from '@fullcalendar/core/locales/es';
import { CardModule } from 'primeng/card';

import { Calendar } from '@fullcalendar/core';
import { MiSemanaService } from './mi-semana.services';

@Component({
  selector: 'app-mi-semana',
  templateUrl: './mi-semana.component.html',
  styleUrls: ['./mi-semana.component.css'],
  standalone: true,
  imports: [ CommonModule, FullCalendarModule, DragDropModule, CardModule]
})
export class MiSemanaComponent {
  events: any[] = [];
  businessHours: any[] = [];

  holidays: string[] = ['2024-07-18']; // Lista de días feriados

  selectedDate: Date | undefined;
  esLocale: any;

  calendarOptions: any = {};
  currentDate: Date = new Date();
  calendarApi: Calendar | undefined;

  usuarioId: number = 0;
  fechaInicial: any;
  fechaFinal: any;

  constructor(public servicios: MiSemanaService) {



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
      allDaySlot: false, // Elimina la franja "todo el día"
      height: 1320, // Establece la altura del calendario
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

    };
  }


  async  ngOnInit(){

    /*
    Reglas
    1. Cargar los datos del seguimiento
    2. Cargar los datos del perfil de horario del usuario, mezclar con los festivos
    */

    // TODO:  SERVICIO DE FESTIVOS Y DE HORARIO LABORAL USUARIO
    //let usuarioId = sessionStorage.getItem('usuarioId');
    let usuarioId = 1;

    this.diasLimite(this.currentDate);
    await this.horarioLaboral(usuarioId);
    await this.eventos(usuarioId);




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

    this.fechaInicial = formatDate(f1);
    this.fechaFinal = formatDate(f2);
  }


  async horarioLaboral(usuarioId: number){
    //TODO: REALIZAR CONSUMO HORARIO LABORAL E INTERVENIR CON FESTIVOS

    let festivos = await this.servicios.GetFestivos(this.fechaInicial, this.fechaFinal);
    //let horarioLaboral = await this.servicios.GetHorarioLaboral(this.usuarioId);

    let horario =  [
      {
        daysOfWeek: [ 1, 2, 3 ], // Lunes, Martes, Miércoles
        startTime: '08:00', // 8am
        endTime: '18:00' // 6pm
      },
      {
        daysOfWeek: [ 4 ], // Jueves
        startTime: '07:00',
        endTime:  '07:00'  //(date: { toISOString: () => string; }) => this.holidays.includes(date.toISOString().split('T')[0]) ? '12:00' : '18:00'
      },
      {
        daysOfWeek: [ 5 ], // Viernes
        startTime: '09:00', // 9am
        endTime: '17:00' // 5pm
      }
    ];
    this.calendarOptions.businessHours = horario;
  }

  async eventos(usuarioId: number){
    this.events = await this.servicios.GetSeguimientoUsuario(usuarioId, this.fechaInicial, this.fechaFinal);
    /*this.events = [  { id: 1, title: 'Ramona Soler', start: '2024-07-16T10:00:00', end: '2024-07-16T10:30:00' },
      { id: 2, title: 'Evento 2', start: '2024-07-17T14:00:00', end: '2024-07-17T14:30:00' },
    ];*/
    this.calendarOptions.events = this.events;
  }


  handlePrev() {

    this.currentDate = new Date();
    this.currentDate = this.adjustToWeekStart(new Date(this.currentDate.setDate(this.currentDate.getDate() - 7)));
    if (this.calendarApi) {
      this.calendarApi.gotoDate(this.currentDate);
    }
    console.log(' this.currentDate ', this.currentDate);
  }

  handleNext() {
    this.currentDate = new Date();
    this.currentDate = this.adjustToWeekStart(new Date(this.currentDate.setDate(this.currentDate.getDate() + 7)));
    if (this.calendarApi) {
      this.calendarApi.gotoDate(this.currentDate);
    }
    console.log(' this.currentDate ', this.currentDate);
  }

  adjustToWeekStart(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);

    console.log('la fechaaa '+diff);

    return new Date(date.setDate(diff));
  }


  handleEventDrop(info: any) {
    const event = info.event;
    console.log(`Evento ID: ${event.id}, Nueva Fecha y Hora: ${event.start}`);

    //TODO:  CONSUMIR SERVICIO DE ACTUALIZACION DE DATOS SERVICIO
  }

  isEventAllowed(dropInfo: any) {
    const date = dropInfo.startStr.split('T')[0]; // Obtiene la parte de la fecha sin la hora
    const now = new Date();
    const eventStart = new Date(dropInfo.startStr);

    console.log('this.holidays.includes(date) ', this.holidays.includes(date), ' => ', eventStart, ' now ', now)

    // Verifica si la fecha es un feriado o es anterior a la fecha y hora actual
    if (this.holidays.includes(date) || eventStart < now) {
      return false;
    }

    return true;
  }


  renderEventContent(eventInfo: any) {
    const eventTime = new Date(eventInfo.event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return { html: `<div class="fc-event-custom"><b>${eventInfo.event.title}</b><br><br>Hora Sugerida: ${eventTime}</div>` };
  }


   // Método para inicializar la API del calendario
   initializeCalendarApi(event: any) {
    this.calendarApi = event.view.calendar;
  }
}
