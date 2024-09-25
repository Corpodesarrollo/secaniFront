import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { TarjetaKPIComponent } from "../../shared/tarjetaKPI/tarjetaKPI.component";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
import { CommonModule } from '@angular/common';
import { TarjetaCasoCriticoComponent } from '../../shared/tarjeta-caso-critico/tarjeta-caso-critico.component';
import { TarjetaCabeceraComponent } from "../../shared/tarjeta-cabecera/tarjeta-cabecera.component";
import { DashboardAgenteSeguimientoService } from './dashboard-agente-seguimiento.services';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-agente-seguimiento',
  templateUrl: './dashboard-agente-seguimiento.component.html',
  styleUrls: ['./dashboard-agente-seguimiento.component.css'],
  standalone: true,
  imports: [ChartModule, TarjetaKPIComponent, TarjetaCasoCriticoComponent, CommonModule, TarjetaCabeceraComponent, ReactiveFormsModule ],
})
export class DashboardAgenteSeguimientoComponent implements OnInit {
  totalCasos: number = 5423;
  registrosNuevos: number = 1893;
  misCasos: number = 1893;
  alertas: number = 189;

  seguimientosData: any;
  seguimientosOptions: any;
  nnaData: any;
  nnaOptions: any;
  llamadasData: any;
  llamadasOptions: any;
  alertasData: any;
  alertasOptions: any;
  asignacionesData: any;
  asignacionesOptions: any;

  usuario: any = "Juan Manuel";
  data_1: any = {};
  data_2: any = {};
  data_3: any = {};
  data_4: any = {};

  casosCriticos: any;

  currentDate: Date = new Date();
  fechaInicial: any;
  fechaFinal: any;
  formFechas: FormGroup;

  usuarioId: any;

  cargado = false;


  constructor(public servicios: DashboardAgenteSeguimientoService, private fb: FormBuilder) {

    //TODO: ACTUALIZAR TEMAS DE USUARIO
    this.usuarioId = 1;

    this.diasLimite(this.currentDate);
    this.formFechas = this.fb.group({
      fechaInicio: [this.fechaInicial],
      fechaFin: [this.fechaFinal]
    });

    // Registrar el plugin de DataLabels
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
      },
      {
        estado: 'SIN RESOLVER',
        nombre: 'Jose Luis Vergara Peña',
        tiempo: '3 años, 2 meses y 13 días',
        enfermedad: 'Leucemia linfoide',
        ubicacion: 'Apartadó, Antioquía',
        fecha: '02/09/2024',
        entidades: 'EPS Sánitas, ET Antioquía',
      },
    ];



  }


  async ngOnInit() {


    await this.dataBarra();

    await this.filtroFechas(this.fechaInicial, this.fechaFinal);


    this.cargado = true;
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


  async dataBarra(){

    let dataT1 = await this.servicios.GetTotalCasos(this.fechaInicial, this.fechaFinal, '1');
    let dataP1 =  ((dataT1.totalCasosActual - dataT1.totalCasosAnterior)/dataT1.totalCasosAnterior)*100;

    this.data_1 = {
      imagen:1,
      titulo: 'Total Casos',
      valor: dataT1.totalCasosActual,
      porcentaje: dataP1.toFixed(2)
    }

    let dataT2 = await this.servicios.GetTotalRegistros(this.fechaInicial, this.fechaFinal, '1');
    let dataP2 =  ((dataT2.totalCasosActual - dataT2.totalCasosAnterior)/dataT2.totalCasosAnterior)*100;

    this.data_2 = {
      imagen:2,
      titulo: 'Registros Nuevos',
      valor: dataT2.totalCasosActual,
      porcentaje: dataP2.toFixed(2)
    }

    let dataT3 = await this.servicios.GetTotalMisCasos(this.fechaInicial, this.fechaFinal, '1');
    let dataP3 =  ((dataT3.totalCasosActual - dataT3.totalCasosAnterior)/dataT3.totalCasosAnterior)*100;

    this.data_3 = {
      imagen:3,
      titulo: 'Mis Casos',
      valor: dataT3.totalCasosActual,
      porcentaje: dataP3.toFixed(2)
    }

    let dataT4 = await this.servicios.GetTotalAlertas(this.fechaInicial, this.fechaFinal, '1');
    let dataP4 =  ((dataT4.totalCasosActual - dataT4.totalCasosAnterior)/dataT4.totalCasosAnterior)*100;

    this.data_4 = {
      imagen:4,
      titulo: 'Alertas',
      valor: dataT4.totalCasosActual,
      porcentaje: dataP4.toFixed(2)
    }
  }


  async filtroFechas(fecha_inicial: any, fecha_final: any){

    let parametrica  = await this.servicios.GetEstadoSeguimiento();
    let datos  = await this.servicios.GetEstadosSeguimientos(fecha_inicial, fecha_final, this.usuarioId);

    const backgroundColors = ['#73B7AD', '#FF9801', '#F42F63'];

    const labels = parametrica.map((p: { nombre: any; }) => p.nombre);
    const data = parametrica.map((p: { id: any; }) => {
      const match = datos.find((d: { estadoId: any; }) => d.estadoId === p.id);
      return match ? match.cantidad : 0; // Si no hay match, se pone 0
    });

    this.seguimientosData = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: backgroundColors,
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

    /////////////////////////////////////////////////////////////

    let parametrica2  = await this.servicios.GetEstadoNNA();
    let datos2  = await this.servicios.GetEstadosNNas(fecha_inicial, fecha_final, this.usuarioId);

    // Combinar etiquetas y datos en un solo array para ordenarlo
    const combinedData = parametrica2.map((p: { nombre: any; id: any; }) => {
      const match2 = datos2.find((d: { estadoId: any; }) => d.estadoId === p.id);
      return {
        label: p.nombre,
        data: match2 ? match2.cantidad : 0 // Si no hay match, se pone 0
      };
    });

  // Ordenar de mayor a menor por 'data'
    combinedData.sort((a: { data: number; }, b: { data: number; }) => b.data - a.data);

    // Separar las etiquetas y los datos ya ordenados
    const sortedLabels = combinedData.map((item: { label: any; }) => item.label);
    const sortedData = combinedData.map((item: { data: any; }) => item.data);

    // Asignar los valores ordenados a nnaData
    this.nnaData = {
      labels: sortedLabels, // Etiquetas ordenadas
      datasets: [
        {
          label: 'NNA',
          backgroundColor: '#73B7AD',
          borderColor: '#1E88E5',
          data: sortedData  // Datos ordenados
        }
      ]
    };

    const maxDataValue = Math.max(...this.nnaData.datasets[0].data);
    const dynamicMax = maxDataValue + 5;

    this.nnaOptions = {
      indexAxis: 'y',  // Hace que las barras sean horizontales
      plugins: {
        legend: {
          position: 'top',
        },
        datalabels: {
          anchor: 'end',
          align: 'end',
          color: 'gray',

          font: {
            weight: 'bold',
            size: 12
          },
          formatter: (value: string) => {
            return value ;
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: dynamicMax,
        },
        y: {
          barThickness: 20
        }
      },
      barPercentage: 1.5, // Ajusta el grosor de la barra. Menos de 1 reduce el grosor, más lo aumenta.
      categoryPercentage: 0.5,
    };


     /////////////////////////////////////////////////////////////

    let parametrica3  = await this.servicios.GetTipoFalla();
    parametrica3.push({
      "id": 0,
      "nombre": "Contestado",
      "descripcion": null
    });
    let datos3  = await this.servicios.GetEstadosIntentos(fecha_inicial, fecha_final, this.usuarioId);

    // Combinar etiquetas y datos en un solo array para ordenarlo
    const combinedData3 = parametrica3.map((p: { nombre: any; id: any; }) => {
      const match3 = datos3.find((d: { estadoId: any; }) => d.estadoId === p.id);
      return {
        label: p.nombre,
        data: match3 ? match3.cantidad : 0 // Si no hay match, se pone 0
      };
    });

  // Ordenar de mayor a menor por 'data'
    combinedData3.sort((a: { data: number; }, b: { data: number; }) => b.data - a.data);

    // Separar las etiquetas y los datos ya ordenados
    const sortedLabels3 = combinedData3.map((item: { label: any; }) => item.label);
    const sortedData3 = combinedData3.map((item: { data: any; }) => item.data);

    this.llamadasData = {
      labels: sortedLabels3,
      datasets: [
        {
          label: 'Llamadas',
          backgroundColor: '#73B7AD',
          borderColor: '#73B7AD',
          data: sortedData3
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


     /////////////////////////////////////////////////////////////

     let parametrica4  = await this.servicios.GetEstadoAlerta();

     let datos4  = await this.servicios.GetEstadosAlertas(fecha_inicial, fecha_final, this.usuarioId);

     const totalCantidad = datos4.reduce((sum: any, item: { cantidad: any; }) => sum + item.cantidad, 0);
     console.log('totalCantidad ', totalCantidad)

     datos4 = datos4.map((item: { cantidad: number; }) => {
      return {
          ...item,
          porcentaje: ((item.cantidad / totalCantidad) * 100).toFixed(2) // Porcentaje con 2 decimales
      };
  });

     console.log('datos4 ', datos4)

     const backgroundColors2 = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];

     const labels4 = parametrica4.map((p: { nombre: any; }) => p.nombre);
     const data4 = parametrica4.map((p: { id: any; }) => {
       const match = datos4.find((d: { estadoId: any; }) => d.estadoId === p.id);
       return match ? match.porcentaje : 0; // Si no hay match, se pone 0
     });

    this.alertasData = {
      labels: labels4,
      datasets: [
        {
          data: data4,
          backgroundColor: backgroundColors2,
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


    ////////////////////////////////////////////////////

    let datos5 = await this.servicios.GetFechasAsignacion(fecha_inicial, fecha_final, this.usuarioId);

    const labels5 = datos5.map((d: { fechaAsignacion: string }) => {
      // Convertir la fecha a formato 'YYYY-MM-DD' si es necesario
      return new Date(d.fechaAsignacion).toISOString().split('T')[0];
    });

    const data5 = datos5.map((d: { cantidad: number }) => d.cantidad);

    // Ajustar el objeto asignacionesData
    this.asignacionesData = {
      labels: labels5,
      datasets: [
        {
          label: 'Mis Asignaciones',
          backgroundColor: '#73B7AD',
          borderColor: '#73B7AD',
          data: data5,
          fill: false,
          borderDash: [5, 5]
        }
      ]
    };


  }

  async onSubmit() {
    const fechaInicio = this.formFechas.value.fechaInicio;
    const fechaFin = this.formFechas.value.fechaFin;

    this.filtroFechas(fechaInicio, fechaFin);
  }
}
