import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { CarouselModule } from 'primeng/carousel';
import { CardModule } from 'primeng/card';
import { GenericService } from '../../../../../services/generic.services';

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

  constructor(private repos: GenericService) { }

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
        // BUG-LZ 2026-06-20: el modal mostraba archivoAdjunto (oficio del agente).
        // Aqui debe mostrar el adjunto que envio la EAPB en la respuesta. Backend
        // ahora expone archivoAdjuntoRespuesta poblado desde tabla Adjuntos.
        adjunto: n.archivoAdjuntoRespuesta ? {
          nombre: this.nombreAdjuntoLimpio(n.archivoAdjuntoRespuesta),
          storage: n.archivoAdjuntoRespuesta
        } : null
      }));
  }

  private nombreAdjuntoLimpio(storageName: string): string {
    if (!storageName) return '';
    // Nuevo pattern: AdjuntoRespuesta-{idAlerta}-{FileName}
    let n = storageName.replace(/^AdjuntoRespuesta-\d+-/, '');
    if (n !== storageName) return n;
    // Legacy: AdjuntoRespuesta-{guid}.{ext} -> "Adjunto.{ext}" (FileName original perdido)
    n = storageName.replace(/^AdjuntoRespuesta-/, '');
    const ext = n.split('.').pop();
    return ext ? `Adjunto.${ext}` : n;
  }

  async descargarAdjunto(nombreStorage: string) {
    if (!nombreStorage) return;
    try {
      const blob: any = await this.repos.getFile(`Storage/${nombreStorage}`, '', 'Authentication');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.nombreAdjuntoLimpio(nombreStorage);
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error al descargar adjunto respuesta', err);
    }
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
