import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-reporte-inconsistencia',
  standalone: true,
  imports: [CalendarModule, InputGroupAddonModule, InputGroupModule, CommonModule, ButtonModule, InputTextModule, TableModule],
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
      inconsistencias: {
        fuenteDatos: {
          sivigila: 0.3,
          ruaf: 0.25,
          bdua: 0.15,
          mipres: 0.10,
        },
        entidadTerritorial: {
          etA: 0.20,
          etB: 0.15,
          etC: 0.10,
          etD: 0.25,
          etE: 0.5,
        },
        tipoCancer: {
          lla: 0.20,
          lma: 0.15,
          otrasLeucemias: 0.10,
          otrosCanceres: 0.25
        }
      },
      tiempoPromedioResolucion: '5 días',
      numerosCasosValidos: {
        automaticamente: 1000,
        manualmente: 500
      },
      tasaResidenciaInconsistencas: 0.10,
      impactosTiempoNotificacion: [
        'Incremento del 15% en el tiempo de notificación debido a inconsistencias',
        'Retraso del 10% en el inicio del tratamiento'
      ],
      camposCriticos: {
        fechaInicioTratamiento: 0.05,
        fechaTomaPruebaDiagnostica: 0.07,
        fechaResultadoPruebaDiagnostica: 0.06,
        fechaTomaPruebaConfirmatoria: 0.04,
        fechaResultadoPruebaConfirmatoria: 0.04,
      }
    };
  }
}
