import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-ver-notificacion',
  templateUrl: './ver-notificacion.component.html',
  styleUrls: ['./ver-notificacion.component.css'],
  standalone: true,
  imports: [
    CommonModule, DialogModule, ReactiveFormsModule, FormsModule, CarouselModule, ButtonModule, TagModule
  ]
})
export class VerNotificacionComponent implements OnInit {

  @Input() show: boolean = false;
  // BUG-LZ 2026-06-19: el modal mostraba data mock fija. Ahora recibe la lista real
  // del backend cargada por consultar-alertas (Notificacion/GetNotificationAlerta) y
  // la mapea al shape que el template espera (fecha/de/para/conCopia/asunto/mensaje/firma/adjunto).
  @Input() notificacionesData: any[] = [];
  @Output() closeModal = new EventEmitter<void>();

  paginaActual = 0;

  constructor() { }

  ngOnInit() {
  }

  get notificaciones() {
    return (this.notificacionesData || []).map(n => ({
      fecha: n.fechaNotificacion,
      de: n.emailDe || '',
      para: n.emailPara || n.entidadNotificada || '',
      conCopia: n.emailConCopia || '',
      asunto: n.asuntoNotificacion || '',
      mensaje: n.notificacion || '',
      firma: n.firma || '',
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
      this.paginaActual = Math.max(0, this.notificaciones.length - 1);
    }
  }

  nextPage() {
    if (this.paginaActual < this.notificaciones.length - 1) {
      this.paginaActual++;
    } else {
      this.paginaActual = 0;
    }
  }

  close() {
    this.closeModal.emit();
  }
}
