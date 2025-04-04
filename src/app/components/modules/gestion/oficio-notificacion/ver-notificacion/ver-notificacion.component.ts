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
  @Output() closeModal = new EventEmitter<void>();

  notificaciones = [
    {
      fecha: '20/04/2024',
      de: 'SECÁNI (secani_noreply@minsalud.gov.co)',
      para: 'Maria Eugenia Robledo (mrobledo@ins.go.co)',
      conCopia: 'mrobledo@ins.go.co, aruiz@ing.gov.co',
      asunto: 'URGENTE SEGUNDA Notificación de alerta...',
      mensaje: 'Notificación de alerta por barrera de acceso...',
      firma: `Estrategia De Seguimiento Nacional de Cáncer
Centro de Contacto al Ciudadano
Teléfono: 601 330 5043
www.minsalud.gov.co`,
      adjunto: {
        nombre: 'Oficio de notificación de alerta.pdf',
        url: '/assets/notificacion-alerta.pdf'
      }
    },
    {
      fecha: '20/04/2024',
      de: 'SECÁNI (secani_noreply@minsalud.gov.co)',
      para: 'Maria Eugenia Robledo (mrobledo@ins.go.co)',
      conCopia: 'mrobledo@ins.go.co, aruiz@ing.gov.co',
      asunto: '1232341541451   URGENTE SEGUNDA Notificación de alerta...',
      mensaje: 'Notificación de alerta por barrera de acceso...',
      firma: `Estrategia De Seguimiento Nacional de Cáncer
Centro de Contacto al Ciudadano
Teléfono: 601 330 5043
www.minsalud.gov.co`,
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
      this.paginaActual = this.notificaciones.length - 1;
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
