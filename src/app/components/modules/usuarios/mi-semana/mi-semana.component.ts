import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DragDropModule } from 'primeng/dragdrop';
import { DialogModule } from 'primeng/dialog';
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
  imports: [ CommonModule, FullCalendarModule, DragDropModule, CardModule, DialogModule]
})
export class MiSemanaComponent {
  events: any[] = [];
  businessHours: any[] = [];

  holidays: string[] = []; // Lista de días feriados

  selectedDate: Date | undefined;
  esLocale: any;

  calendarOptions: any = {};
  currentDate: Date = new Date();
  calendarApi: Calendar | undefined;

  usuarioId: number = 0;
  fechaInicial: any;
  fechaFinal: any;

  displayModal: boolean = false;
  headerDialog: string = '';
  bodyDialog: string = '';

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
      allDaySlot: false,
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
      eventClick: this.handleEventClick.bind(this)
    };
  }


  async  ngOnInit(){

    /*
    Reglas
    1. Cargar los datos del seguimiento
    2. Cargar los datos del perfil de horario del usuario, mezclar con los festivos
    */

    // TODO: Determinar id del usuario
    //let usuarioId = sessionStorage.getItem('usuarioId');
    this.usuarioId = 1;

    this.diasLimite(this.currentDate);
    await this.eventos(this.usuarioId);
    await this.horarioLaboral(this.usuarioId);





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


    let festivos = await this.servicios.GetFestivos(this.fechaInicial, this.fechaFinal);
    //console.log("festivos", festivos)
    let horarioLaboral = await this.servicios.GetHorarioLaboral(this.usuarioId, this.fechaInicial, this.fechaFinal);


    const getDayOfWeek = (dateString: string): number => {
      const date = new Date(dateString);
      // Los días en JavaScript van de 0 (domingo) a 6 (sábado)
      const day = date.getDay();
      // Ajustamos para que el lunes sea 1, martes 2, etc.
      return day === 0 ? 7 : day;
    };

    // Convertir las fechas festivas a un conjunto para una búsqueda rápida
    const festivosSet = new Set(festivos.map((festivo: { festivo: string }) => festivo.festivo));

    // Transformación de la respuesta
    let horario = horarioLaboral.map((item: { fecha: string; horaEntrada: string; horaSalida: string }) => {
      const dayOfWeek = getDayOfWeek(item.fecha);

      // Verificar si la fecha es festiva
      const isFestivo = festivosSet.has(item.fecha);

      // Ajustar startTime y endTime si es festivo
      return {
        daysOfWeek: [dayOfWeek],
        startTime: isFestivo ? '07:00:00' : item.horaEntrada,
        endTime: isFestivo ? '07:00:00' : item.horaSalida
      };
    });


    this.calendarOptions.businessHours = horario;
  }

  async eventos(usuarioId: number){
    let eventosBD = await this.servicios.GetSeguimientoUsuario(usuarioId, this.fechaInicial, this.fechaFinal);


    // Función para sumar 30 minutos a una fecha
    let addMinutes = (date: Date, minutes: number): Date => {
      return new Date(date.getTime() + minutes * 60000);
    };

    this.events = eventosBD.map((item: { primerNombre: any; segundoNombre: any; primerApellido: any; segundoApellido: any; fechaSeguimiento: string | number | Date; cantidadAlertas: any; fechaNotificacionSIVIGILA: any; id: any; }) => {
      // Concatenar nombres y apellidos
      let title = `${item.primerNombre} ${item.segundoNombre} ${item.primerApellido} ${item.segundoApellido}`.trim();

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
    console.log("this.events", this.events);
    this.calendarOptions.events = this.events;
  }


  handlePrev() {

    this.currentDate = new Date();
    this.currentDate = this.adjustToWeekStart(new Date(this.currentDate.setDate(this.currentDate.getDate() - 7)));
    if (this.calendarApi) {
      this.calendarApi.gotoDate(this.currentDate);
    }

  }

  handleNext() {
    this.currentDate = new Date();
    this.currentDate = this.adjustToWeekStart(new Date(this.currentDate.setDate(this.currentDate.getDate() + 7)));
    if (this.calendarApi) {
      this.calendarApi.gotoDate(this.currentDate);
    }

  }

  adjustToWeekStart(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);

    console.log('la fechaaa '+diff);

    return new Date(date.setDate(diff));
  }


  async handleEventDrop(info: any) {
    const event = info.event;

    let data = {
      "Id": event.id,
      "FechaSeguimiento": this.formatDateTimeForSQLServer(event.start)
    }

    let respuesta = await this.servicios.PutActualizarSeguimiento(data);
    console.log("respuesta ", respuesta);
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
    console.log(event)
    //console.log(`Evento ID: ${event.id}, Nueva Fecha y Hora: ${event.start}`);
    this.displayModal = true;
    this.headerDialog = "Seguimiento "+this.formatDateTimeForSQLServer(event.start);

    this.bodyDialog = "<p style='text-align: center'>"+event.title+"<br>Seguimiento No. "+event.id+"<br>Alertas Detectadas: "+event.extendedProps.cantidadAlertas+"<br>Reportado por SIVIGILA el "+event.extendedProps.fechaNotificacionSIVIGILA+"</p>"

  }



}
