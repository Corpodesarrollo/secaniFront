import { Component, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { ListboxModule } from 'primeng/listbox';
import { CommonModule } from '@angular/common';
import { GenericService } from '../../../services/generic.services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-boton-notificacion',
  standalone: true,
  imports: [DialogModule, CommonModule, ButtonModule, BadgeModule, ListboxModule], 
  templateUrl: './boton-notificacion.component.html',
  styleUrl: './boton-notificacion.component.css'
})
export class BotonNotificacionComponent implements OnInit {
  showDialog: boolean = false;
  idUsuario: string = "48e6efab-2c8a-4d37-bc6c-d62ec8fdd0c5";
  cntNotificaciones: number = 0;
  notificaciones: any[] = [];

  constructor(
    private repos: GenericService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.consultarNotificaciones();
  }

  consultarNotificaciones() {
    this.repos.get('Notificacion/GetNumeroNotification/', `${this.idUsuario}`, 'Seguimiento').subscribe({
      next: (data: any) => {
        this.cntNotificaciones = data;
      }
    });

    this.repos.get('Notificacion/GetNotification/', `${this.idUsuario}`, 'Seguimiento').subscribe({
      next: (data: any) => {
        this.notificaciones = data;
      }
    });
  }

  openUrl(url:string, id: number){
    this.repos.get('Notificacion/EliminarNotificacion/', `${id}`, 'Seguimiento').subscribe({
      next: (data: any) => {
        this.consultarNotificaciones();
      }
    });

    this.router.navigate([url]);
  }
}