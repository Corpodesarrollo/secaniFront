import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { GenericService } from '../../../../../services/generic.services';
import { Seguimiento } from '../../../../../models/seguimiento.model';
import { VerRespuestaComponent } from '../../oficio-notificacion/ver-respuesta/ver-respuesta.component';

@Component({
  selector: 'app-seguimiento-historial',
  standalone: true,
  imports: [TableModule, BadgeModule, CardModule, CommonModule, RouterModule, DialogModule, ButtonModule, VerRespuestaComponent],
  templateUrl: './seguimiento-historial.component.html',
  styleUrl: './seguimiento-historial.component.css'
})
export class SeguimientoHistorialComponent {
  @Input() id!: number;
  seguimientos: Seguimiento[] = [];

  showDialog: boolean = false;
  notificacionesData: any[] = [];

  constructor(private repos: GenericService) { }

  async ngOnInit(): Promise<void> {
    this.CargarDatos();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id'] && !changes['id'].firstChange) {
      this.CargarDatos();
    }
  }

  CargarDatos() {
    this.repos.get('Seguimiento/GetSeguimientosByNNA/', `${this.id}`, 'Seguimiento').subscribe({
      next: (data: any) => {
        const items = Array.isArray(data) ? data.slice() : [];
        items.sort((a: any, b: any) => {
          const fa = new Date(a?.fechaUltimaActuacion ?? a?.fechaSeguimiento ?? 0).getTime();
          const fb = new Date(b?.fechaUltimaActuacion ?? b?.fechaSeguimiento ?? 0).getTime();
          if (fb !== fa) return fb - fa;
          return (b?.id ?? 0) - (a?.id ?? 0);
        });
        this.seguimientos = items;
      }
    });
  }

  cargarRespuestas(seguimientoId: number) {
    this.notificacionesData = [];
    this.repos.get('Notificacion/GetNotificationSeguimiento/', `${seguimientoId}`, 'Seguimiento').subscribe({
      next: (data: any) => {
        this.notificacionesData = Array.isArray(data) ? data : [];
        this.showDialog = true;
      },
      error: () => {
        this.notificacionesData = [];
        this.showDialog = true;
      }
    });
  }

  cerrarModal() {
    this.showDialog = false;
  }

  stripHtml(html: string | null | undefined): string {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  }

  getBadgeColor(estadoAlerta: number): string {
    switch (estadoAlerta) {
      case 4:
        return ' ';
      case 1 || 2:
        return 'bg-warning';
      case 3:
        return 'bg-danger';
      case 5:
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
}
