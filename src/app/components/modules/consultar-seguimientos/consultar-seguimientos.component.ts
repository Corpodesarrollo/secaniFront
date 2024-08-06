import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { Seguimiento } from '../../../models/seguimiento.model';
import { CommonModule } from '@angular/common';
import { BotonNotificacionComponent } from "../boton-notificacion/boton-notificacion.component";
import { GenericService } from '../../../services/generic.services';
import { SeguimientoCntFiltros } from '../../../models/seguimientoCntFiltros.model';

@Component({
  selector: 'app-consultar-seguimientos',
  standalone: true,
  imports: [TableModule, BadgeModule, CardModule, CommonModule, BotonNotificacionComponent ],
  templateUrl: './consultar-seguimientos.component.html',
  styleUrl: './consultar-seguimientos.component.css',
  encapsulation: ViewEncapsulation.None
})

export class ConsultarSeguimientosComponent implements OnInit {

  idUsuario: string = "48e6efab-2c8a-4d37-bc6c-d62ec8fdd0c5";
  cntFiltros: SeguimientoCntFiltros = {
    hoy: 0,
    conAlerta: 0,
    todos: 0,
    solicitadosPorCuidador: 0
  };
  seguimientos: Seguimiento[] = [];
  activeFilter: string = '1';

  constructor(
    private repos: GenericService,
  ) { }

  ngOnInit(): void {
    this.CargarDatos('1');

    this.repos.get('Seguimiento/GetCntSeguimiento/', `${this.idUsuario}`, 'Seguimiento').subscribe({
      next: (data: any) => {
        this.cntFiltros = data;
      }
    });
   }

   applyFilter(filter: string) {
    this.activeFilter = filter;
    this.CargarDatos(filter);
  }

  CargarDatos(filter: string){
    this.repos.get('Seguimiento/GetAllByIdUser/', `${this.idUsuario}/${filter}`, 'Seguimiento').subscribe({
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
