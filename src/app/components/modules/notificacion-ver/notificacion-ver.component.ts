import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { GenericService } from '../../../services/generic.services';
import { apis } from '../../../models/apis.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notificacion-ver',
  standalone: true,
  imports: [DialogModule, CommonModule],
  templateUrl: './notificacion-ver.component.html',
  styleUrls: ['./notificacion-ver.component.css']
})
export class NotificacionVerComponent {
  @Input() alertaId!: number;
  @Input() show: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  // Bug 2026-06-17: antes este modal llamaba GestionarAlertas/Alerta (RespuestasAlerta = la
  // respuesta de la EAPB) y el HTML caia en un template hardcoded con datos "Ejemplo" cuando
  // la respuesta era 500. Ahora carga la notificacion real (NotificacionEntidad) y muestra
  // estado vacio explicito si no existe.
  notificacion: any = null;
  cargando: boolean = false;
  error: string = '';

  constructor(private gs: GenericService) { }

  close() {
    this.show = false;
    this.closeModal.emit();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['show'] && changes['show'].currentValue) {
      this.notificacion = null;
      this.error = '';
      if (this.alertaId > 0) {
        await this.cargarNotificacion();
      }
    }
  }

  async cargarNotificacion() {
    this.cargando = true;
    try {
      const data: any = await this.gs.getAsync('GestionarAlertas/NotificacionEntidad', `/${this.alertaId}`, apis.seguimiento);
      this.notificacion = data || null;
      // Bug 2026-06-17: NotificacionEntidad.EmailPara nunca se persiste -> "Para" siempre vacio.
      // Resolvemos el nombre de la entidad receptora (EAPB) via EAPB/byId/{entidadId} para mostrar
      // un destinatario util en el modal.
      if (this.notificacion && this.notificacion.entidadId > 0 && !this.notificacion.emailPara) {
        try {
          const eapb: any = await this.gs.getAsync('EAPB/byId', `/${this.notificacion.entidadId}`, apis.tablaParametrica);
          if (eapb && eapb.nombre) {
            this.notificacion.emailPara = eapb.nombre;
          }
        } catch (errEAPB) {
          console.warn('No se pudo resolver entidad receptora', errEAPB);
        }
      }
    } catch (err) {
      console.error('Error al cargar la notificacion', err);
      this.error = 'No se pudo cargar la notificacion.';
    } finally {
      this.cargando = false;
    }
  }
}
