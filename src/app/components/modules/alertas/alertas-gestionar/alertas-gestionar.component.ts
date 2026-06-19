import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { apis } from '../../../../models/apis.model';
import { GenericService } from '../../../../services/generic.services';
import { AlertasGestion } from '../../../../models/alertasGestion.model';
import { User } from '../../../../core/services/user';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificacionVerComponent } from "../../notificacion-ver/notificacion-ver.component";
import { AlertasEnviarRespuestaComponent } from "../alertas-enviar-respuesta/alertas-enviar-respuesta.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-alertas-gestionar',
  standalone: true,
  imports: [TableModule, CardModule, CommonModule, FormsModule, NotificacionVerComponent, AlertasEnviarRespuestaComponent],
  templateUrl: './alertas-gestionar.component.html',
  styleUrl: './alertas-gestionar.component.css'
})
export class AlertasGestionarComponent {
  // HU SECANI-RQ07-HU03: la lista se restringe a las alertas de la entidad del usuario.
  // alias = NI + NIT (convencion qa-login); backend lo traduce a EAPBId.
  xUser = new User();
  eapb: string = this.xUser.enterpriseName || 'EPS Sanitas';
  alertas: AlertasGestion[] = [];
  user: string = this.xUser.alias || 'admin';

  displayModal: boolean = false;
  displayModalEnviarRespuesta: boolean = false;
  alertaId: number = 0;
  nombreNNA: string = '';
  documentoNNA: string = '';
  alerta: string = '';

  constructor(
    private router: Router, private repos: GenericService
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
    this.displayModal = true;
  }

  closeModalAlerta() {
    console.log('cerrar modal');
    this.displayModal = false;
  }

  closeModalEnviarRespuesta() {
    this.displayModalEnviarRespuesta = false;
  }

  enviarRespuesta(alerta: AlertasGestion) {
    this.alertaId = alerta.idAlerta;
    this.nombreNNA = alerta.nombreNNA;
    this.documentoNNA = alerta.documentoNNA;
    this.alerta = `${alerta.categoria} - ${alerta.alerta} ${alerta.subcategoria}`;
    this.displayModalEnviarRespuesta = true;
  }

  verRespuesta(alerta: AlertasGestion) {
    this.router.navigate([`/gestion/consultar-alertas/${alerta.idSeguimiento}`]).then(() => {
        window.scrollTo(0, 0);
      });
  }
}
