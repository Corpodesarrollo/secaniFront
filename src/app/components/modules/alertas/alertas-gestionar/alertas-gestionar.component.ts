import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { apis } from '../../../../models/apis.model';
import { GenericService } from '../../../../services/generic.services';
import { AlertasGestion } from '../../../../models/alertasGestion.model';
import { User } from '../../../../core/services/user';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// BUG-LZ 2026-06-20: el modal NotificacionVerComponent mostraba un solo registro de
// NotificacionEntidad con campos incompletos (Para resolvia a nombre EAPB, sin Firma,
// sin Adjuntos descargables). Reusar VerNotificacionComponent (mismo que /consultar-alertas)
// que recibe la lista completa via Notificacion/GetNotificationAlerta y la pinta consistente.
import { VerNotificacionComponent } from "../../gestion/oficio-notificacion/ver-notificacion/ver-notificacion.component";
import { VerRespuestaComponent } from "../../gestion/oficio-notificacion/ver-respuesta/ver-respuesta.component";
import { AlertasEnviarRespuestaComponent } from "../alertas-enviar-respuesta/alertas-enviar-respuesta.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-alertas-gestionar',
  standalone: true,
  imports: [TableModule, CardModule, CommonModule, FormsModule, VerNotificacionComponent, VerRespuestaComponent, AlertasEnviarRespuestaComponent],
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
  displayModalRespuesta: boolean = false;
  alertaId: number = 0;
  nombreNNA: string = '';
  documentoNNA: string = '';
  alerta: string = '';
  notificacionesAlerta: any[] = [];

  // BUG-LZ 2026-06-20: filtros UI por Nombre NNA y Categoria.
  filtroNombre: string = '';
  filtroCategoria: string = '';

  get alertasFiltradas(): AlertasGestion[] {
    const fn = (this.filtroNombre || '').trim().toLowerCase();
    const fc = (this.filtroCategoria || '').trim().toLowerCase();
    if (!fn && !fc) return this.alertas;
    return this.alertas.filter(a =>
      (!fn || (a.nombreNNA || '').toLowerCase().includes(fn)) &&
      (!fc || (a.categoria || '').toLowerCase().includes(fc))
    );
  }

  get categoriasUnicas(): string[] {
    const set = new Set<string>();
    (this.alertas || []).forEach(a => { if (a.categoria) set.add(a.categoria); });
    return Array.from(set).sort();
  }

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
    this.notificacionesAlerta = [];
    this.repos.get('Notificacion/GetNotificationAlerta/', `${alertaId}`, apis.seguimiento).subscribe({
      next: (data: any) => { this.notificacionesAlerta = data || []; },
      error: (err: any) => { console.error('Error al cargar notificaciones', err); }
    });
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

  // BUG-LZ 2026-06-20: antes verRespuesta navegaba a /consultar-alertas (cambio de pantalla).
  // Ahora abre el modal app-ver-respuesta inline, igual que en /consultar-alertas/{id}.
  verRespuesta(alerta: AlertasGestion) {
    this.alertaId = alerta.idAlerta;
    this.notificacionesAlerta = [];
    this.repos.get('Notificacion/GetNotificationAlerta/', `${alerta.idAlerta}`, apis.seguimiento).subscribe({
      next: (data: any) => { this.notificacionesAlerta = data || []; },
      error: (err: any) => { console.error('Error al cargar respuestas', err); }
    });
    this.displayModalRespuesta = true;
  }

  closeModalRespuesta() {
    this.displayModalRespuesta = false;
  }
}
