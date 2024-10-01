import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { TarjetaKPIComponent } from "../../shared/tarjetaKPI/tarjetaKPI.component";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
import { CommonModule } from '@angular/common';
import { TarjetaCasoCriticoComponent } from '../../shared/tarjeta-caso-critico/tarjeta-caso-critico.component';
import { TarjetaCabeceraComponent } from "../../shared/tarjeta-cabecera/tarjeta-cabecera.component";
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DashboardEapbService } from './dashboard-eapb.services';

@Component({
  selector: 'app-dashboard-eapb',
  templateUrl: './dashboard-eapb.component.html',
  styleUrls: ['./dashboard-eapb.component.css'],
  standalone: true,
  imports: [ChartModule, TarjetaKPIComponent, TarjetaCasoCriticoComponent, TarjetaCabeceraComponent, CommonModule, SpinnerComponent, ReactiveFormsModule],
})
export class DashboardEapbComponent implements OnInit {


  usuario: any = "EPS Sanitas";
  data_1: any = {};
  data_2: any = {};
  data_3: any = {};

  alertasData: any;
  alertasData2: any;
  alertasOptions: any;
  alertasOptions2: any;

  alertas: any;
  badge: any;

  cargado = false;

  currentDate: Date = new Date();
  fechaInicial: any;
  fechaFinal: any;
  formFechas: FormGroup;

  usuarioId: any;

  constructor( private fb: FormBuilder, public servicios: DashboardEapbService) {

    //TODO: ACTUALIZAR TEMAS DE USUARIO
    this.usuarioId = '48e6efab-2c8a-4d37-bc6c-d62ec8fdd0c5';

    this.diasLimite(this.currentDate);
    this.formFechas = this.fb.group({
      fechaInicio: [this.fechaInicial],
      fechaFin: [this.fechaFinal]
    });

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

  diasLimite(currentDate: Date) {


    const currentWeekday = currentDate.getDay(); // Obtiene el día de la semana actual (0 = domingo, 1 = lunes, ..., 6 = sábado)

    let f1 = new Date(currentDate);
    let f2 = new Date(currentDate);

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses de 0 a 11
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }


    f1.setDate(currentDate.getDate() - currentWeekday + 1);
    f2.setDate(currentDate.getDate() - currentWeekday + 5);

    this.fechaInicial = formatDate(f1);
    this.fechaFinal = formatDate(f2);
  }


  async ngOnInit() {

    await this.dataBarra();

    await this.filtroFechas(this.fechaInicial, this.fechaFinal);






  }


  async dataBarra(){
    let dataT1 = await this.servicios.GetTotalCasos(this.fechaInicial, this.fechaFinal, '1');
    let dataP1 =  ((dataT1.totalCasosActual - dataT1.totalCasosAnterior)/dataT1.totalCasosAnterior)*100;

    this.data_1 = {
      imagen:1,
      titulo: 'Total Casos en Colombia',
      valor: dataT1.totalCasosActual,
      porcentaje: dataP1.toFixed(2)
    }



    this.data_2 = {
      imagen:2,
      titulo: 'Registros propios',
      valor: dataT1.totalCasosActual,
      porcentaje: dataP1.toFixed(2)
    }


    this.data_3 = {
      imagen:3,
      titulo: 'Alertas',
      valor: dataT1.totalCasosActual,
      porcentaje: dataP1.toFixed(2)
    }


  }

  async filtroFechas(fecha_inicial: any, fecha_final: any){
    this.cargado = false;

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


    //--------------------------------------

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


    this.cargado = true;
  }

}
