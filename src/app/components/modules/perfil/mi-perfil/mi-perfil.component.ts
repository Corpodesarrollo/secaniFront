import { Component, OnInit, ViewChild } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { BotonNotificacionComponent } from "../../boton-notificacion/boton-notificacion.component";
import { ModalCrearComponent } from '../../usuarios/eapb/modal-crear/modal-crear.component';
import { Usuario } from '../../../../models/usuario.model';
import { GenericService } from '../../../../services/generic.services';
import { NotificacionService } from '../../../../core/services/notificacionService';
import { User } from '../../../../core/services/user';
import { apis } from '../../../../models/apis.model';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, CalendarModule, CheckboxModule, CardModule, DialogModule, InputSwitchModule, FormsModule, BotonNotificacionComponent, TableModule, ModalCrearComponent, ReactiveFormsModule, ToastModule],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css',
  providers: [MessageService]
})
export class MiPerfilComponent implements OnInit {
  @ViewChild(ModalCrearComponent) modalCrearComponent!: ModalCrearComponent;

  estadoUsuario: boolean = true;
  fecha: string = '';
  usuario!: Usuario;
  idUser: string = "";
  user = new User();

  data: any[] = [
    { nombreApe: 'Luz Maria Soler', cargo: 'Jefe de Enfermeras', telefono: '3208987514', correo: 'luz1@sanitas.com', estado: 'Activo' },
    { nombreApe: 'Luz Maria Soler', cargo: 'Jefe de Enfermeras', telefono: '3208987515', correo: 'luz2@sanitas.com', estado: 'Inactivo' },
    { nombreApe: 'Felipe Arias', cargo: 'Jefe de Doctores', telefono: '3208987516', correo: 'luz3@sanitas.com', estado: 'Activo' },
    { nombreApe: 'Luz Maria Soler', cargo: 'Jefe de Enfermeras', telefono: '3208987516', correo: 'luz4@sanitas.com', estado: 'Activo' }
  ];

  selectedItem: any = null;
  isEditing: boolean = false;

  first = 0;
  rows = 10;

  vistaPerfil: string = '';
  // Datos para la primera tabla
  public datosHorarioAgente = [
    { diaActivo: false, dia: 'Domingo', horaInicio: '', horaFin: '' },
    { diaActivo: false, dia: 'Lunes', horaInicio: '', horaFin: '' },
    { diaActivo: false, dia: 'Martes', horaInicio: '', horaFin: '' },
    { diaActivo: false, dia: 'Miercoles', horaInicio: '', horaFin: '' },
    { diaActivo: false, dia: 'Jueves', horaInicio: '', horaFin: '' },
    { diaActivo: false, dia: 'Viernes', horaInicio: '', horaFin: '' },
    { diaActivo: false, dia: 'Sabado', horaInicio: '', horaFin: '' },
  ];

  // Datos para la segunda tabla
  public datosAusenciasAgente: { id: string, fecha: Date; motivo: string }[] = [];

  public workScheduleForm: FormGroup;
  public visibleWorkScheduleForm: boolean = false;
  public selectedSchedule: any = null;

  public selectedDate: Date | null = null;
  public visibleAbsenceForm = false;
  public absenceForm: FormGroup;

  constructor(private dataService: GenericService, private fb: FormBuilder, private notificacionService: NotificacionService, private messageService: MessageService) {
    this.workScheduleForm = this.fb.group({
      inicio: this.fb.group({
        hh: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
        mm: ['', [Validators.required, Validators.min(0), Validators.max(59)]],
        meridiem: ['AM', Validators.required]
      }),
      fin: this.fb.group({
        hh: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
        mm: ['', [Validators.required, Validators.min(0), Validators.max(59)]],
        meridiem: ['PM', Validators.required]
      })
    });

    this.absenceForm = this.fb.group({
      reason: ['', Validators.required]
    });
  }

  async ngOnInit() {
    
    this.idUser = this.user.id ?? '0';
    //this.vistaSegunPerfiil(this.user.enterpriseCode);
    this.obtenerDatosUsuario();
    this.vistaSegunPerfiil('M');
    this.obtenerHorarioAgente();
  }

  obtenerDatosUsuario() {
    if (!this.idUser || this.idUser === '0') return;
    this.dataService.get('User/GetUserDetails/', this.idUser, 'Permisos').subscribe({
      next: (data: any) => {
        this.usuario = data;
        this.estadoUsuario = this.usuario.estado === 'Activo';
        
      },
      error: (e) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al obtener los del usuario',
          detail: 'Ocurrió un problema al obtener los datos del usuario en el sistema.',
          life: 3000
        });
      },
      complete: () => console.info('Consulta usuario exitosa')
    });
  }

  obtenerHorarioAgente(): void {
    if (!this.idUser || this.idUser === '0') return;
    this.dataService.get('api/horario-laboral/obtener-usuario/', this.idUser, 'Seguimiento').subscribe({
      next: (data: any[]) => { this.actualizarHorarios(data) },
      error: (e) => console.error('Se presento un error al consultar los horarios del usuario', e),
      complete: () => console.info('Consulta del horario del usuario existosa')
    });
  }

  obtenerDatosAusenciaAgente(): void {
    if (!this.idUser || this.idUser === '0') return;
    this.dataService.get('api/Ausencias/usuario/', this.idUser, 'Seguimiento').subscribe({
      next: (data: { id: string, fecha: Date; motivo: string }[]) => { this.datosAusenciasAgente = data },
      error: (e) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al obtener los datos de ausencia',
          detail: 'Ocurrió un problema al obtener los datos de las ausencia registradas.',
          life: 3000
        });
      },
      complete: () => console.info('Consulta del horario del usuario existosa')
    });
  }

  vistaSegunPerfiil(parametro: any): void {
    if (parametro === 'MU' || parametro === 'DE' || parametro === 'DI') {
      this.vistaPerfil = 'vistaEntidadEAPB';
    } else {
      this.vistaPerfil = 'vistaUsuario';
    }
  }

  actualizarHorarios(horariosRecibidos: any[]) {
    // Primero, resetear todos los días a inactivos
    this.datosHorarioAgente.forEach(dia => {
      dia.diaActivo = false;
      dia.horaInicio = '';
      dia.horaFin = '';
    });

    // Actualizar solo los días que vienen en la respuesta
    horariosRecibidos.forEach(horario => {
      const indice = horario.dia;
      if (indice !== undefined && indice >= 0 && indice < this.datosHorarioAgente.length) {
        this.datosHorarioAgente[indice].diaActivo = true;
        this.datosHorarioAgente[indice].horaInicio = this.formatearHora(horario.horaEntrada);
        this.datosHorarioAgente[indice].horaFin = this.formatearHora(horario.horaSalida);
      }
    });
  }

  // Función auxiliar para formatear la hora
  // Convierte "08:00:00" a "08:00"
  formatearHora(horaCompleta: string): string {
    return horaCompleta.substring(0, 5);
  }

  /**Modal Crear y Editar**/

  onEdit(item: any) {
    this.selectedItem = item;
    this.isEditing = true; // Modo edición
    this.openModal();
  }

  onCreate() {
    this.selectedItem = null; // Asegúrate de que no hay datos seleccionados
    this.isEditing = false; // Modo creación
    this.openModal();
  }

  openModal() {
    if (this.modalCrearComponent) {
      this.modalCrearComponent.open(); // Abre el modal
    }
  }

  /**Paginador**/
  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  isLastPage(): boolean {
    return this.data ? this.first === this.data.length - this.rows : true;
  }

  isFirstPage(): boolean {
    return this.data ? this.first === 0 : true;
  }

  onEstadoChange(nuevoEstado: boolean) {
    const data = { ...this.usuario, estado: nuevoEstado };
    console.log(data);
    this.dataService.put(`user/EditUserProfile/${this.idUser}`, data, apis.authentication).subscribe({
      next: async (value) => {
        console.log('Estado actualizado con éxito');
        this.usuario = { ...this.usuario, estado: `${nuevoEstado}` } 
        await this.notificacionService.set({
          idAgenteOrigen: this.usuario.id ?? '',
          agenteOrigen: '',
          rolAgenteOrigen: '',
          idAgenteDestino: '',
          agenteDestino: '',
          rolAgenteDestino: '',
          tipoNotificacion: 6,
          idSeguimiento: 0,
          textoNotificacion: '',
          fechaNotificacion: new Date().toISOString(),
          uRLNotificacion: '',
          idNotificacion: 0,
        });
      },
      error: (err) => { console.log },
    });
  }

  showWorkScheduleDialog(item: any) {
    this.selectedSchedule = item; // guardamos cuál se está editando
    const start = this.convertTimeToForm(item.horaInicio);
    const end = this.convertTimeToForm(item.horaFin);
    this.workScheduleForm.patchValue({ start, end });
    this.visibleWorkScheduleForm = true;
  }

  saveSchedule() {
    if (this.workScheduleForm.valid) {
      const formValue = this.workScheduleForm.value;
      // Construimos el objeto que el backend espera
      const payload = {
        userId: this.idUser,
        dia: this.selectedSchedule.dia,
        horaEntrada: this.convertFormToTime(formValue.start),
        horaSalida: this.convertFormToTime(formValue.end)
      };

      this.dataService.post(`api/horario-laboral/guardar-dia`, payload, "Seguimiento").subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Horario guardado',
            detail: 'El horario laboral se guardó correctamente.',
            life: 3000
          });
          this.visibleWorkScheduleForm = false;
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al guardar',
            detail: 'Ocurrió un problema al guardar el horario laboral.',
            life: 3000
          });
          console.error('Error al guardar el horario:', err);
        }
      });

    } else {
      this.workScheduleForm.markAllAsTouched();
    }
  }

  closeWorkScheduleDialog() {
    this.visibleWorkScheduleForm = false;
  }

  /** Convert "08:00:00" -> { hh: 8, mm: 0, meridiem: 'AM' } */
  private convertTimeToForm(time: string): { hh: number; mm: number; meridiem: 'AM' | 'PM' } {
    const [hourStr, minuteStr] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    const meridiem = hour >= 12 ? 'PM' : 'AM';
    if (hour === 0) hour = 12; // midnight
    else if (hour > 12) hour -= 12;

    return { hh: hour, mm: minute, meridiem };
  }

  /** Convert { hh: 8, mm: 0, meridiem: 'AM' } -> "08:00:00" */
  private convertFormToTime(value: { hh: number; mm: number; meridiem: string }): string {
    let hour = value.hh;
    if (value.meridiem === 'PM' && hour < 12) {
      hour += 12;
    }
    if (value.meridiem === 'AM' && hour === 12) {
      hour = 0;
    }

    const hh = hour.toString().padStart(2, '0');
    const mm = value.mm.toString().padStart(2, '0');
    return `${hh}:${mm}:00`;
  }

  openAbsenceDialog(): void {
  if (!this.selectedDate) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Selecciona una fecha',
      detail: 'Debes seleccionar una fecha antes de registrar la ausencia.',
      life: 3000
    });
    return;
  }
  this.visibleAbsenceForm = true;
}

saveAbsence(): void {
  if (!this.absenceForm.valid || !this.selectedDate) {
    this.absenceForm.markAllAsTouched();
    return;
  }

  // Construir payload
  const payload = {
    usuarioId: this.idUser,
    fechaAusencia: this.selectedDate.toISOString().split('T')[0],
    motivoAusencia: this.absenceForm.value.reason
  };

  // Enviar solicitud al backend
  this.dataService.post("api/ausencias", payload, 'Seguimiento').subscribe({
    next: () => {
      // Éxito
      this.messageService.add({
        severity: 'success',
        summary: 'Ausencia guardada',
        detail: 'La ausencia se guardó correctamente.',
        life: 3000
      });

      // Limpiar formulario y cerrar modal
      this.absenceForm.reset();
      this.visibleAbsenceForm = false;

      // Refrescar tabla o datos relacionados
      this.obtenerDatosAusenciaAgente();
    },

    error: (err) => {
      // Mensaje original del backend
      const rawMessage = err?.error?.MESSAGE || 'Ocurrió un error desconocido.';

      // Limpiar UUID del mensaje para mostrarlo al usuario
      const cleanedMessage = rawMessage.replace(
        /para\s+[\w-]+\s+en\s+/,
        'para este usuario en '
      );

      // Mostrar mensaje de error
      this.messageService.add({
        severity: 'error',
        summary: 'Error al guardar',
        detail: cleanedMessage,
        life: 4000
      });
    }
  });
}

cancelAbsenceDialog(): void {
  this.visibleAbsenceForm = false;
}

deleteAbsence(data: any): void {
  this.dataService.deleteWithApi(`api/ausencias/${data.id}`, '' ,"Seguimiento").subscribe({
    next: () => {
      this.messageService.add({
        severity: 'info',
        summary: 'Ausencia eliminada',
        detail: 'La ausencia se eliminó correctamente.',
        life: 3000
      });
      this.obtenerDatosAusenciaAgente(); // refrescar tabla
    },
    error: (err) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error al eliminar',
        detail: 'Ocurrió un problema al eliminar la ausencia.',
        life: 3000
      });
      console.error('Error al eliminar ausencia:', err);
    }
  });
}
}
