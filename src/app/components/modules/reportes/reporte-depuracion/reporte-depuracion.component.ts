import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ReportesService } from '../../../../services/reportes.service';

@Component({
  selector: 'app-reporte-depuracion',
  standalone: true,
  imports: [ButtonModule, CalendarModule, CommonModule, InputGroupAddonModule, InputGroupModule, InputTextModule, TableModule],
  templateUrl: './reporte-depuracion.component.html',
  styleUrl: './reporte-depuracion.component.css'
})
export class ReporteDepuracionComponent implements OnInit {
  public reportes: any[] = [];

  constructor(private reportesService: ReportesService) {}

  ngOnInit(): void {
    /* this.reportes = [
      {
        id: 1,
        fecha: new Date(),
        hora: '05:00 PM',
        registros: {
          ingresado: 500,
          nuevos: 50,
          duplicados: 450
        },
        estado: 'Procesada'
      },
      {
        id: 2,
        fecha: new Date(),
        hora: '05:30 PM',
        registros: {
          ingresado: 850,
          nuevos: 22,
          duplicados: 828
        },
        estado: 'Fallida'
      }
    ] */
    this.obtenerReportes();
  }

  async obtenerReportes() {
    this.reportes = await this.reportesService.getReporteEstadoDepuracion();
    console.log(this.reportes);
  }
}
