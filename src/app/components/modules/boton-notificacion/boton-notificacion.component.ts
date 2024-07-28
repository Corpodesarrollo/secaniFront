import { Component, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { ListboxModule } from 'primeng/listbox';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-boton-notificacion',
  standalone: true,
  imports: [DialogModule, CommonModule, ButtonModule, BadgeModule, ListboxModule], 
  templateUrl: './boton-notificacion.component.html',
  styleUrl: './boton-notificacion.component.css'
})
export class BotonNotificacionComponent implements OnInit {
  showDialog: boolean = false;
  notifications: {message: string}[] = [];

  ngOnInit(): void {
    // Simulación de carga de notificaciones
    this.notifications = [
      { message: 'Notificación 1' },
      { message: 'Notificación 2' },
      { message: 'Notificación 3' }
    ];
  }
}