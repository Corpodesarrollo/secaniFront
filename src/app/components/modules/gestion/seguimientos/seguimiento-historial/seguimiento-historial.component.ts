import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { GenericService } from '../../../../../services/generic.services';
import { SeguimientoHistorial } from '../../../../../models/seguimientoHistorial.model';

@Component({
  selector: 'app-seguimiento-historial',
  standalone: true,
  imports: [TableModule, BadgeModule, CardModule, CommonModule, RouterModule, DialogModule],
  templateUrl: './seguimiento-historial.component.html',
  styleUrl: './seguimiento-historial.component.css'
})
export class SeguimientoHistorialComponent {
  @Input() id!: number;
  seguimientos: SeguimientoHistorial[] = [];

  constructor(
    private repos: GenericService
  ) { }

  onSubmit() {
    this.CargarDatos();
  }

  CargarDatos() {
    this.repos.get('Seguimiento/GetSeguimientosNNA/', `${this.id}`, 'Seguimiento').subscribe({
      next: (data: any) => {
        this.seguimientos = data;
      }
    });
  }

  getBadgeColor(estadoAlerta: number): string {
    switch (estadoAlerta) {
      case 4: // Resuelta
        return ' '; // Verde
      case 1 || 2:
        return 'bg-warning'; // Amarillo
      case 3:
        return 'bg-danger'; // Rojo
      case 5:
        return 'bg-danger'; // Gris
      default:
        return 'bg-secondary'; // Por defecto
    }
  }
}
