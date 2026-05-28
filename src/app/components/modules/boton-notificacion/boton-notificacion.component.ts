import { Component, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { ListboxModule } from 'primeng/listbox';
import { CommonModule } from '@angular/common';
import { GenericService } from '../../../services/generic.services';
import { Router } from '@angular/router';
import { User } from '../../../core/services/user';
import { environment } from '../../../../environments/environment';
import { apis } from '../../../models/apis.model';

@Component({
  selector: 'app-boton-notificacion',
  standalone: true,
  imports: [DialogModule, CommonModule, ButtonModule, BadgeModule, ListboxModule], 
  templateUrl: './boton-notificacion.component.html',
  styleUrl: './boton-notificacion.component.css'
})
export class BotonNotificacionComponent implements OnInit {
  xUser = new User();
  showDialog: boolean = false;
  idUsuario: string = "48e6efab-2c8a-4d37-bc6c-d62ec8fdd0c5";
  cntNotificaciones: number = 0;
  notificaciones: any[] = [];

  constructor(
    private repos: GenericService,
    private router: Router
  ){}

  ngOnInit(): void {
    if (this.xUser.id != null) {
      this.idUsuario = this.xUser.id;
    } else{
      window.location.href = environment.url_Sispro;
    }
    this.consultarNotificaciones();
  }
  
  consultarNotificaciones() {
    this.repos.get('Notificacion/GetNumeroNotification/', `${this.idUsuario}`, 'Seguimiento')
      .subscribe({
        next: (data) => this.cntNotificaciones = data
      });

    this.repos.get('Notificacion/GetNotification/', `${this.idUsuario}`, 'Seguimiento')
      .subscribe({
        next: (data) => this.notificaciones = Array.isArray(data) ? data : []
      });
  }

  // "Ver": solo navega al caso. NO borra la notificacion (antes openUrl hacia ambas cosas).
  verNotificacion(url: string) {
    this.showDialog = false;
    if (url) {
      this.router.navigate([url]);
    }
  }

  // Boton basura: descarta la notificacion (soft delete) y la quita de la lista en vivo.
  eliminarNotificacion(id: number) {
    this.repos.post('Notificacion/EliminarNotificacion/', { idNotificacionUsuario: id, idUsuario: this.idUsuario }, apis.seguimiento)
      .subscribe({
        next: () => {
          this.notificaciones = this.notificaciones.filter(n => n.idNotificacion !== id);
          if (this.cntNotificaciones > 0) {
            this.cntNotificaciones--;
          }
        }
      });
  }
}