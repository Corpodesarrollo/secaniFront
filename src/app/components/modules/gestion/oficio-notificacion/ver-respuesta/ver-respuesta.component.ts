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
  @Output() closeModal = new EventEmitter<void>();

  alertaTexto: any = '1. Accesibilidad - 1.F. No tener implementados esquemas de diagnóstico'

  respuestas = [
    {
      fecha: '20/04/2024',
      entidad: '1 SECÁNI (secani_noreply@minsalud.gov.co)',
      funcionario: 'Maria Eugenia Robledo (mrobledo@ins.go.co)',
      cargo: 'Administración',
      correo: 'mrobledo@ins.go.co, aruiz@ing.gov.co',
      telefono: '6013305043',
      mensaje: 'Notificación de alerta por barrera de acceso...',
      adjunto: {
        nombre: 'Oficio de notificación de alerta.pdf',
        url: '/assets/notificacion-alerta.pdf'
      }
    },
    {
      fecha: '20/04/2024',
      entidad: '2 SECÁNI (secani_noreply@minsalud.gov.co)',
      funcionario: 'Maria Eugenia Robledo (mrobledo@ins.go.co)',
      cargo: 'Administración',
      correo: 'mrobledo@ins.go.co, aruiz@ing.gov.co',
      telefono: '6013305043',
      mensaje: 'Notificación de alerta por barrera de acceso...',
      adjunto: {
        nombre: 'Oficio de notificación de alerta.pdf',
        url: '/assets/notificacion-alerta.pdf'
      }
    },
    {
      fecha: '20/04/2024',
      entidad: '3 SECÁNI (secani_noreply@minsalud.gov.co)',
      funcionario: 'Maria Eugenia Robledo (mrobledo@ins.go.co)',
      cargo: 'Administración',
      correo: 'mrobledo@ins.go.co, aruiz@ing.gov.co',
      telefono: '6013305043',
      mensaje: 'Notificación de alerta por barrera de acceso...',
      adjunto: {
        nombre: 'Oficio de notificación de alerta.pdf',
        url: '/assets/notificacion-alerta.pdf'
      }
    }
  ];

  paginaActual = 0;

  constructor() { }

  ngOnInit() {
  }

  prevPage() {
    if (this.paginaActual > 0) {
      this.paginaActual--;
    } else {
      this.paginaActual = this.respuestas.length - 1;
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
