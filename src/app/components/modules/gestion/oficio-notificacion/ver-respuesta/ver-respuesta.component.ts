import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { CarouselModule } from 'primeng/carousel';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-ver-respuesta',
  templateUrl: './ver-respuesta.component.html',
  styleUrls: ['./ver-respuesta.component.css'],
  standalone: true,
  imports: [
    CommonModule, DialogModule, ReactiveFormsModule, FormsModule, CarouselModule, ButtonModule, TagModule, CardModule
  ]
})
export class VerRespuestaComponent implements OnInit {

  @Input() show: boolean = false;
  // BUG-LZ 2026-06-19: el modal mostraba data mock fija. Ahora recibe la lista real
  // del backend cargada por consultar-alertas (Notificacion/GetNotificationAlerta) y
  // filtra solo las entradas que tienen respuesta de la entidad.
  @Input() notificacionesData: any[] = [];
  @Output() closeModal = new EventEmitter<void>();

  paginaActual = 0;

  alertaTexto: string = '';

  constructor() { }

  ngOnInit() {
  }

  get respuestas() {
    return (this.notificacionesData || [])
      .filter(n => !!n.respuesta)
      .map(n => ({
        fecha: n.fechaRespuesta,
        entidad: n.entidadNotificada || '',
        funcionario: n.emailPara || '',
        cargo: '',
        correo: n.emailDe || '',
        telefono: '',
        mensaje: n.respuesta || '',
        adjunto: n.archivoAdjunto ? {
          nombre: n.archivoAdjunto,
          url: `${(window as any).STORAGE_BASE || ''}/Storage/DownloadFile/${encodeURIComponent(n.archivoAdjunto)}`
        } : null
      }));
  }

  prevPage() {
    if (this.paginaActual > 0) {
      this.paginaActual--;
    } else {
      this.paginaActual = Math.max(0, this.respuestas.length - 1);
    }
  }

  nextPage() {
    if (this.paginaActual < this.respuestas.length - 1) {
      this.paginaActual++;
    } else {
      this.paginaActual = 0;
    }
  }

  close() {
    this.closeModal.emit();
  }
}
