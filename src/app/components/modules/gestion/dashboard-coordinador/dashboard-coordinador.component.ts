import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { TarjetaKPIComponent } from "../../shared/tarjetaKPI/tarjetaKPI.component";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
import { CommonModule } from '@angular/common';
import { TarjetaCasoCriticoComponent } from '../../shared/tarjeta-caso-critico/tarjeta-caso-critico.component';
import { TarjetaCabeceraComponent } from "../../shared/tarjeta-cabecera/tarjeta-cabecera.component";

@Component({
  selector: 'app-dashboard-coordinador',
  templateUrl: './dashboard-coordinador.component.html',
  styleUrls: ['./dashboard-coordinador.component.css'],
  standalone: true,
  imports: [ChartModule, TarjetaKPIComponent, TarjetaCasoCriticoComponent, TarjetaCabeceraComponent, CommonModule,],
})
export class DashboardCoordinadorComponent implements OnInit {

  usuario: any = "Juan Manuel";
  data_1: any = {};
  casosCriticos: any;

  nnaData: any;
  nnaOptions: any;
  seguimientosData: any;
  seguimientosOptions: any;
  llamadasData: any;
  llamadasOptions: any;
  alertasData: any;
  alertasOptions: any;

  constructor() {

    Chart.register(ChartDataLabels);
    this.casosCriticos = [
      {
        estado: 'EN TRÁMITE',
        nombre: 'Ana del Pilar Ruiz Bolaños',
        tiempo: '3 años, 2 meses y 13 días',
        enfermedad: 'Leucemia linfoide',
        ubicacion: 'Apartadó, Antioquía',
        fecha: '02/09/2024',
        entidades: 'EPS Sánitas, ET Antioquía',
        agente: 'Marisol García'
      },
      {
        estado: 'SIN RESOLVER',
        nombre: 'Jose Luis Vergara Peña',
        tiempo: '3 años, 2 meses y 13 días',
        enfermedad: 'Leucemia linfoide',
        ubicacion: 'Apartadó, Antioquía',
        fecha: '02/09/2024',
        entidades: 'EPS Sánitas, ET Antioquía',
        agente: 'Marisol García'
      },
      {
        estado: 'EN TRÁMITE',
        nombre: 'Ana del Pilar Ruiz Bolaños',
        tiempo: '3 años, 2 meses y 13 días',
        enfermedad: 'Leucemia linfoide',
        ubicacion: 'Apartadó, Antioquía',
        fecha: '02/09/2024',
        entidades: 'EPS Sánitas, ET Antioquía',
        agente: 'Marisol García'
      },
      {
        estado: 'SIN RESOLVER',
        nombre: 'Jose Luis Vergara Peña',
        tiempo: '3 años, 2 meses y 13 días',
        enfermedad: 'Leucemia linfoide',
        ubicacion: 'Apartadó, Antioquía',
        fecha: '02/09/2024',
        entidades: 'EPS Sánitas, ET Antioquía',
        agente: 'Marisol García'
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


    this.nnaData = {
      labels: ['Diagnóstico no encontrado', 'En diagnóstico', 'En tratamiento', 'Bajo observación', 'Dado de alta'],
      datasets: [
        {
          label: 'NNA',
          backgroundColor: '#73B7AD',
          borderColor: '#1E88E5',
          data: [10, 25, 30, 5, 20]
        }
      ]
    };

    const maxDataValue = Math.max(...this.nnaData.datasets[0].data);
    const dynamicMax = maxDataValue + 5;

    this.nnaOptions = {
      plugins: {
        datalabels: {
          color: 'gray',
          font: {
            weight: 'bold',
            size: 16
          },
          formatter: (value: any, context: any) => {
            return value;  // Mostrando solo el valor
          }
        }
      }
    };


    this.seguimientosData = {
      labels: ['Por Iniciar', 'En Proceso', 'Culminado'],
      datasets: [
        {
          data: [5, 14, 250],
          backgroundColor: ['#FFCE56', '#36A2EB', '#FF6384'],
        }
      ]
    };

    this.seguimientosOptions = {
      plugins: {
        datalabels: {
          color: 'gray',
          font: {
            weight: 'bold',
            size: 16
          },
          formatter: (value: any, context: any) => {
            return value;  // Mostrando solo el valor
          }
        }
      }
    };



    this.llamadasData = {
      labels: ['Contactados', 'En Proceso', 'Culminado'],
      datasets: [
        {
          label: 'Llamadas',
          backgroundColor: '#73B7AD',
          borderColor: '#73B7AD',
          data: [96, 50, 10]
        }
      ]
    };

    this.llamadasOptions = {
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'end',
          color: 'gray',
          font: {
            weight: 'bold',
            size: 12
          },
          formatter: (value: any, context: any) => {
            return value + ' llamadas';  // Mostrando el valor con texto adicional
          }
        }
      }
    };



    this.alertasData = {
      labels: ['Importantes', 'Tratamiento', 'Continuidad', 'Autorizaciones'],
      datasets: [
        {
          data: [12, 67, 16, 5],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
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


  }

}
