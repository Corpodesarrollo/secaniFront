import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { TarjetaKPIComponent } from "../../shared/tarjetaKPI/tarjetaKPI.component";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
import { CommonModule } from '@angular/common';
import { TarjetaCasoCriticoComponent } from '../../shared/tarjeta-caso-critico/tarjeta-caso-critico.component';
import { TarjetaCabeceraComponent } from "../../shared/tarjeta-cabecera/tarjeta-cabecera.component";

@Component({
  selector: 'app-dashboard-eapb',
  templateUrl: './dashboard-eapb.component.html',
  styleUrls: ['./dashboard-eapb.component.css'],
  standalone: true,
  imports: [ChartModule, TarjetaKPIComponent, TarjetaCasoCriticoComponent, TarjetaCabeceraComponent, CommonModule,],
})
export class DashboardEapbComponent implements OnInit {


  usuario: any = "EPS Sanitas";
  data_1: any = {};
  data_3: any = {};

  alertasData: any;
  alertasData2: any;
  alertasOptions: any;
  alertasOptions2: any;

  alertas: any;
  badge: any;

  constructor() {
    Chart.register(ChartDataLabels);
    this.alertas = [
      {

        nombre: 'Ana del Pilar Ruiz Bolaños',
        tiempo: '3 años, 2 meses y 13 días',
        enfermedad: 'Leucemia linfoide',
        sinRespuesta: '6',
        color: '#FF9801'
      },
      {

        nombre: 'Jose Luis Vergara Peña',
        tiempo: '3 años, 2 meses y 13 días',
        enfermedad: 'Leucemia linfoide',
        sinRespuesta: '7',
        color: '#EC2121'
      },
      {

        nombre: 'Ana del Pilar Ruiz Bolaños',
        tiempo: '3 años, 2 meses y 13 días',
        enfermedad: 'Leucemia linfoide',
        sinRespuesta: '6',
        color: '#FF9801'
      },
      {

        nombre: 'Jose Luis Vergara Peña',
        tiempo: '3 años, 2 meses y 13 días',
        enfermedad: 'Leucemia linfoide',
        sinRespuesta: '7',
        color: '#EC2121'
      },
    ];

  }

  ngOnInit() {

    this.data_1 = {
      imagen:1,
      titulo: 'Total Casos',
      valor: '5423',
      porcentaje: 16
    }
    this.data_3 = {
      imagen:1,
      titulo: 'Alertas',
      valor: '9',

    }

    this.alertasData = {
      labels: ['Importantes', 'Tratamiento', 'Continuidad', 'Autorizaciones'],
      datasets: [
        {
          data: [12, 67, 16, 5],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        }
      ]
    };

    this.alertasData2 = {
      labels: ['Con Alerta', 'Sin Alerta'],
      datasets: [
        {
          data: [5, 12],
          backgroundColor: [ '#36A2EB', '#FF6384'],
        }
      ]
    };

    this.alertasOptions = {
      plugins: {
        datalabels: {
          color: 'gray',
          font: {
            weight: 'bold',
            size: 14
          },
          formatter: (value: any, context: any) => {
            return value +'%';  // Mostrando solo el valor
          }
        }
      }
    };

    this.alertasOptions2 = {
      plugins: {
        datalabels: {
          color: 'gray',
          font: {
            weight: 'bold',
            size: 14
          },
          formatter: (value: any, context: any) => {
            return value;  // Mostrando solo el valor
          }
        }
      }
    };


  }

}
