import { Component } from '@angular/core';
import { apis } from '../../../../models/apis.model';
import { GenericService } from '../../../../services/generic.services';
import { AlertasGestion } from '../../../../models/alertasGestion.model';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificacionVerComponent } from "../../notificacion-ver/notificacion-ver.component";

@Component({
  selector: 'app-alertas-gestionar',
  standalone: true,
  imports: [TableModule, CardModule, CommonModule, FormsModule, NotificacionVerComponent],
  templateUrl: './alertas-gestionar.component.html',
  styleUrl: './alertas-gestionar.component.css'
})
export class AlertasGestionarComponent {
  eapb: string = 'EPS Sanitas';
  alertas: AlertasGestion[] = [];
  user: string = 'admin';

  displayModal: boolean = false;
  alertaId: number = 0;

  constructor(
    private repos: GenericService
  ) { }

  ngOnInit(): void {
    this.CargarDatos();
  }

  CargarDatos() {
    this.repos.get('GestionarAlertas/ConsultarAlertas', `/${this.user}`, apis.seguimiento).subscribe({
      next: (data: any) => {
        this.alertas = data;
      }
    });
  }

  verAlerta(alertaId: number) {
    this.alertaId = alertaId;
    console.log('ver alerta', this.displayModal);
    this.displayModal = true;
  }

  closeModalAlerta() {
    console.log('cerrar modal');
    this.displayModal = false;
  }

  enviarRespuesta(value: any) {
  }
  
  verRespuesta(value: any) {
  }
}
