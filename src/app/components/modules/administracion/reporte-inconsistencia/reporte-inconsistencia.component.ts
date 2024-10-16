import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-reporte-inconsistencia',
  standalone: true,
  imports: [CalendarModule, CommonModule, ButtonModule, InputTextModule, TableModule],
  templateUrl: './reporte-inconsistencia.component.html',
  styleUrl: './reporte-inconsistencia.component.css'
})
export class ReporteInconsistenciaComponent implements OnInit {
  public reporte?: any;

  ngOnInit(): void {
    this.reporte = {
      totalInconsistencias: 4,
      distribucionTipoCampo: {
        nombre: 300,
        fechasNacimiento: 250,
        diagnosticoas: 400,
        tipoIdentificacion: 200,
        otros: 350
      },
      inconsistenciasFuenteDatos: {
        sivigila: 0.3,
        ruaf: 0.25,
        bdua: 0.15,
        mipres: 0.10,
      }
    };
  }
}
