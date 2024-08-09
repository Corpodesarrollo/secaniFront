import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ActivatedRoute } from '@angular/router';
import { GenericService } from '../../../../services/generic.services';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-detalle-seguimientos',
  standalone: true,
  imports: [CommonModule, BadgeModule, CardModule, TableModule, RouterModule],
  templateUrl: './detalle-seguimientos.component.html',
  styleUrl: './detalle-seguimientos.component.css'
})

export class DetalleSeguimientosComponent implements OnInit{
  seguimientos: any[] = [];
  idSeguimiento: string = "";

  constructor(
    private route: ActivatedRoute,
    private repos: GenericService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.idSeguimiento = params.get('idSeguimiento') || ''; // Recupera el valor del parámetro
    });
    console.log(this.idSeguimiento);
    this.repos.get_withoutParameters(`Seguimiento/GetSeguimientosNNA?idNNA=${this.idSeguimiento}`, 'Seguimiento').subscribe({
      next: (data: any) => {
        this.seguimientos = data;
        console.log(this.seguimientos);
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
