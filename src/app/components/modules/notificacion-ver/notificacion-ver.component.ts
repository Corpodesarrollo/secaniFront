import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { GenericService } from '../../../services/generic.services';
import { apis } from '../../../models/apis.model';
import { RespuestasAlerta } from '../../../models/respuestasAlerta.model';
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
  @Output() closeModal = new EventEmitter<void>(); // Emite un evento al cerrar el modal

  alerta: RespuestasAlerta = {
    id: 0,
    de: '',
    notificacionEntidadId: 0,
    nombre: '',
    cargo: '',
    correo: '',
    telefono: '',
    respuesta: '',
    entidadId: 0,
    asunto: '',
    conCopia: '',
    firma: '',
    mensaje: '',
    para: '',
    AlertaId: 0,
    dateCreated: new Date()
  };

  constructor(private gs: GenericService) { }

  close() {
    this.show = false;
    this.closeModal.emit(); // Emite evento para cerrar el modal
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['show'] && changes['show'].currentValue) {
      if (this.alertaId > 0) {
        await this.cargarAlerta();
      } 
    }
  }

  async cargarAlerta() {
    try {
      const data: any = await this.gs.getAsync('GestionarAlertas/Alerta', `/${this.alertaId}`, apis.seguimiento);
      let dataResult = data as RespuestasAlerta;
      this.alerta = dataResult;
      console.log('alerta', this.alerta);
    } catch (error) {
      console.error('Error al cargar la alerta', error); 
    }
  }
}
