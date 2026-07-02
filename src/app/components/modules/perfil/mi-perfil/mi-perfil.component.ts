import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';

import { BotonNotificacionComponent } from "../../boton-notificacion/boton-notificacion.component";
import { ModalCrearComponent } from '../../usuarios/eapb/modal-crear/modal-crear.component';
import { Usuario } from '../../../../models/usuario.model';
import { GenericService } from '../../../../services/generic.services';
import { NotificacionService } from '../../../../core/services/notificacionService';
import { User } from '../../../../core/services/user';
import { apis } from '../../../../models/apis.model';
import { forkJoin, switchMap, tap } from 'rxjs';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PermisoDirective } from '../../../../directives/permiso.directive';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, CalendarModule, CheckboxModule, CardModule, DialogModule, InputSwitchModule, FormsModule, BotonNotificacionComponent, TableModule, ModalCrearComponent, ReactiveFormsModule, ToastModule, InputTextareaModule, ConfirmDialogModule, TooltipModule, PermisoDirective],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css',
  providers: [MessageService, ConfirmationService]
})
export class MiPerfilComponent implements OnInit {
  @ViewChild(ModalCrearComponent) modalCrearComponent!: ModalCrearComponent;

  usuario!: any;
  user = new User();

  estadoUsuario: boolean = true;
  idUser: string = "";

  data: any[] = [];

  // Variables para controlar vistas
  public vistaEntidad: boolean = false;

  // Datos para la primera tabla
  public datosHorarioAgente = [
    { diaActivo: false, dia: 'Domingo', horaEntrada: '', horaSalida: '' },
    { diaActivo: false, dia: 'Lunes', horaEntrada: '', horaSalida: '' },
    { diaActivo: false, dia: 'Martes', horaEntrada: '', horaSalida: '' },
    { diaActivo: false, dia: 'Miercoles', horaEntrada: '', horaSalida: '' },
    { diaActivo: false, dia: 'Jueves', horaEntrada: '', horaSalida: '' },
    { diaActivo: false, dia: 'Viernes', horaEntrada: '', horaSalida: '' },
    { diaActivo: false, dia: 'Sabado', horaEntrada: '', horaSalida: '' },
  ];

  // Datos para la segunda tabla
  public datosAusenciasAgente: { id: string, fecha: Date; motivo: string }[] = [];

  public datosContactosAgente: any[] = [];
  public contactoSeleccionado: any = null;
  public editarContancto: boolean = false;

  public formularioHorarioLaboral: FormGroup;
  public dialogoHorarioLaboralVisible: boolean = false;
  public horarioSeleccionado: any = null;

  public fechaSeleccionada: Date | null = null;
  public dialogoAusenciaVisible: boolean = false;
  public formularioAusencia: FormGroup;
  public minFechaAusencia: Date = (() => { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(0,0,0,0); return d; })();

  constructor(private dataService: GenericService, private fb: FormBuilder, private notificacionService: NotificacionService, private messageService: MessageService, private confirmationService: ConfirmationService, private router: Router) {
    this.formularioHorarioLaboral = this.fb.group({
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

    this.formularioAusencia = this.fb.group({
      motivo: ['', Validators.required]
    });
  }

  ngOnInit() {
    // BUG-007: Redirigir EAPB/ET a perfil entidad, HU RQ09-HU05
    if (this.user.isEAPB || this.user.isET) {
      this.router.navigate(['/perfil/mi-perfil-entidad']);
      return;
    }
    this.idUser = this.user.id ?? '0';
    this.cargarPerfilCompleto();
  }

  private cargarPerfilCompleto(): void {
    this.dataService.get('User/GetUserDetails/', this.idUser, 'Permisos').pipe(
      tap((data: any) => {
        this.usuario = data;
        // BUG-015: backend retorna bool, legacy string 'Activo'
        this.estadoUsuario = data.estado === true || data.estado === 'Activo' || data.activo === true;
        this.vistaEntidad = this.esVistaEntidad(data.enterpriseCode);
      }),

      switchMap((user: any) => {
        if (this.esVistaEntidad(user.enterpriseCode)) {
          return this.dataService.get('ContactoEntidad/Entidades/', this.idUser, 'Entidad')
            .pipe(
              tap(contactos => {
                this.datosContactosAgente = contactos;
              })
            );
        }

        return forkJoin({
          horarios: this.dataService.get('api/horario-laboral/obtener-usuario/', this.idUser, 'Seguimiento'),
          ausencias: this.dataService.get('api/Ausencias/usuario/', this.idUser, 'Seguimiento'),
        }).pipe(
          tap(({ horarios, ausencias }) => {
            this.actualizarHorarios(horarios);
            this.datosAusenciasAgente = ausencias;
          })
        );
      })
    ).subscribe({
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al cargar perfil',
          detail: 'Ocurrió un problema al cargar los datos del usuario.',
          life: 3000
        });
      }
    });
  }

  // Función para determinar si se muestra la vista de entidad o usuario
  private esVistaEntidad(code: string | null | undefined): boolean {
    const enterpriseCodes = ['MU', 'DE', 'DI'];
    return enterpriseCodes.includes(code?.toUpperCase() ?? '');
  }

 
  // Función para abrir el modal de creación/edición de contacto
  editarContacto(item: any) {
    this.contactoSeleccionado = item;
    this.editarContancto = true;      // Modo edición
    this.openModal();
  }

  crearContacto() {
    this.contactoSeleccionado = null; // Asegúrate de que no hay datos seleccionados
    this.editarContancto = false;     // Modo creación
    this.openModal();
  }

  openModal() {
    if (this.modalCrearComponent) {
      this.modalCrearComponent.open(); // Abre el modal
    }
  }

  // BUG-015: Cambio de estado con confirmación + regla único agente
  onEstadoChange(nuevoEstado: boolean) {
    if (nuevoEstado === false) {
      this.confirmationService.confirm({
        header: 'Inactivar usuario',
        message: '¿Está seguro de inactivar el usuario? Todos sus casos serán reasignados a otros agentes. Al activarse nuevamente los casos asignados serán diferentes a los actuales.',
        acceptLabel: 'Inactivar usuario',
        rejectLabel: 'Volver',
        accept: () => this.aplicarCambioEstado(false),
        reject: () => {
          this.estadoUsuario = true;
        }
      });
      return;
    }
    this.aplicarCambioEstado(true);
  }

  private aplicarCambioEstado(nuevoEstado: boolean) {
    const data = { ...this.usuario, estado: nuevoEstado };
    this.dataService.put(`user/EditUserProfile/${this.idUser}`, data, apis.authentication).subscribe({
      next: async () => {
        this.usuario = { ...this.usuario, estado: nuevoEstado ? 'Activo' : 'Inactivo' };
        this.estadoUsuario = nuevoEstado;
        this.messageService.add({ severity: 'success', summary: 'Estado actualizado', detail: nuevoEstado ? 'Usuario activado' : 'Usuario inactivado', life: 3000 });
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
      error: (err) => {
        const msg = err?.error?.message || 'No fue posible actualizar el estado';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: msg, life: 6000, sticky: false });
        this.estadoUsuario = !nuevoEstado;
      }
    });
  }

  // BUG-LZ-002: backend retorna 7 dias siempre (faltantes con 00:00:00).
  // Solo marcar diaActivo si tiene horas configuradas (!= 00:00:00).
  private actualizarHorarios(horariosRecibidos: any[]) {
    this.datosHorarioAgente.forEach(d => {
      d.diaActivo = false;
      d.horaEntrada = '';
      d.horaSalida = '';
    });
    horariosRecibidos.forEach(horario => {
      const indice = horario.dia;
      if (indice === undefined || indice < 0 || indice >= this.datosHorarioAgente.length) return;
      const entrada = (horario.horaEntrada || '').toString();
      const salida = (horario.horaSalida || '').toString();
      const inactivo = this.esHoraVacia(entrada) && this.esHoraVacia(salida);
      this.datosHorarioAgente[indice].diaActivo = !inactivo;
      this.datosHorarioAgente[indice].horaEntrada = inactivo ? '' : entrada;
      this.datosHorarioAgente[indice].horaSalida = inactivo ? '' : salida;
    });
  }

  private esHoraVacia(t: string): boolean {
    if (!t) return true;
    const norm = t.trim();
    return norm === '' || norm === '00:00:00' || norm === '00:00' || norm.startsWith('00:00:00');
  }

  private cargarHorarios(): void {
    this.dataService
      .get('api/horario-laboral/obtener-usuario/', this.idUser, 'Seguimiento')
      .subscribe({
        next: (horarios) => this.actualizarHorarios(horarios),
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al cargar horarios',
            detail: 'Ocurrió un problema al cargar los horarios laborales del usuario.',
            life: 3000
          });
        }
      });
  }

  mostrarDialogoHorarioLaboral(item: any): void {
    // BUG-LZ INC-08: reset antes de patch para evitar arrastre del dia anterior
    this.formularioHorarioLaboral.reset();
    this.horarioSeleccionado = item;
    this.formularioHorarioLaboral.patchValue({
      inicio: this.convertTimeToForm(item.horaEntrada || '08:00:00'),
      fin: this.convertTimeToForm(item.horaSalida || '17:00:00')
    });
    this.dialogoHorarioLaboralVisible = true;
  }

  guardarHorario() {
    if (!this.formularioHorarioLaboral.valid) return this.formularioHorarioLaboral.markAllAsTouched();

    const formValue = this.formularioHorarioLaboral.value;
    const payload = {
      userId: this.idUser,
      dia: this.obtenerNumeroDia(this.horarioSeleccionado.dia),
      horaEntrada: this.convertFormToTime(formValue.inicio),
      horaSalida: this.convertFormToTime(formValue.fin)
    };
    console.log('Payload a enviar:', payload);

    this.dataService.post(`api/horario-laboral/guardar-dia`, payload, "Seguimiento").subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Horario guardado',
          detail: 'El horario laboral se guardó correctamente.',
          life: 3000
        });
        this.cargarHorarios(); // Refrescar horarios después de guardar
        this.cerrarDialogoHorarioLaboral(); // Cerrar diálogo después de guardar
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

  }

  cerrarDialogoHorarioLaboral(): void {
    this.dialogoHorarioLaboralVisible = false;
    this.formularioHorarioLaboral.reset();
    this.horarioSeleccionado = null;
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

  // Función para obtener el número del día de la semana a partir del nombre (0=Domingo, 1=Lunes, ..., 6=Sábado)
  private obtenerNumeroDia(nombreDia: string): number {
    const dias: any = {
      "domingo": 0,
      "lunes": 1,
      "martes": 2,
      "miercoles": 3,
      "miércoles": 3,
      "jueves": 4,
      "viernes": 5,
      "sabado": 6,
      "sábado": 6
    };

    return dias[nombreDia.toLowerCase()];
  }


  private cargarAusencias(): void {
    this.dataService
      .get('api/Ausencias/usuario/', this.idUser, 'Seguimiento')
      .subscribe({
        next: (ausencias) => this.datosAusenciasAgente = ausencias,
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al cargar ausencias',
            detail: 'Ocurrió un problema al cargar las ausencias del usuario.',
            life: 3000
          });
        }
      });
  }

  mostrarDialogoAusencia(): void {
    if (!this.fechaSeleccionada) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Selecciona una fecha',
        detail: 'Debes seleccionar una fecha antes de registrar la ausencia.',
        life: 3000
      });
      return;
    }
    this.dialogoAusenciaVisible = true;
  }

  guardarAusencia(): void {
    if (!this.formularioAusencia.valid || !this.fechaSeleccionada) {
      this.formularioAusencia.markAllAsTouched();
      return;
    }

    // BUG-LZ-003: validar minimo 1 dia anticipacion antes de enviar
    const seleccion = new Date(this.fechaSeleccionada);
    seleccion.setHours(0, 0, 0, 0);
    const manana = new Date();
    manana.setHours(0, 0, 0, 0);
    manana.setDate(manana.getDate() + 1);
    if (seleccion < manana) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Fecha inválida',
        detail: 'La fecha de ausencia debe registrarse con al menos un día de anticipación.',
        life: 4000
      });
      return;
    }

    const payload = {
      usuarioId: this.idUser,
      fechaAusencia: this.fechaSeleccionada.toISOString().split('T')[0],
      motivoAusencia: this.formularioAusencia.value.motivo
    };

    this.dataService.post("api/ausencias", payload, 'Seguimiento').subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Ausencia guardada',
          detail: 'La ausencia se guardó correctamente.',
          life: 3000
        });
        this.formularioAusencia.reset();
        this.cerrarDialogoAusencia();
        this.cargarAusencias();
      },

      error: (err) => {
        // BUG-LZ-003: backend retorna array [{code, message, field}]; antes leía MESSAGE (uppercase)
        const detail = this.extraerMensajeError(err) || 'Ocurrió un error al guardar la ausencia.';
        const cleaned = detail.replace(/para\s+[\w-]+\s+en\s+/, 'para este usuario en ');
        this.messageService.add({
          severity: 'error',
          summary: 'Error al guardar',
          detail: cleaned,
          life: 5000
        });
      }
    });
  }

  private extraerMensajeError(err: any): string {
    const body = err?.error;
    if (!body) return '';
    if (Array.isArray(body) && body.length > 0) {
      const first = body[0];
      return first?.message || first?.Message || '';
    }
    if (typeof body === 'string') return body;
    return body?.message || body?.Message || body?.MESSAGE || '';
  }

  cerrarDialogoAusencia(): void {
    this.dialogoAusenciaVisible = false;
    this.fechaSeleccionada = null;
    this.formularioAusencia.reset();
  }

  eliminarAusencia(data: any): void {
    this.dataService.deleteWithApi(`api/ausencias/${data.id}`, '', "Seguimiento").subscribe({
      next: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Ausencia eliminada',
          detail: 'La ausencia se eliminó correctamente.',
          life: 3000
        });
        this.cargarAusencias(); // refrescar tabla
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al eliminar',
          detail: 'Ocurrió un problema al eliminar la ausencia.',
          life: 3000
        });
      }
    }); 
  }
}
