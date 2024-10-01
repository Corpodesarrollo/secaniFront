import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { TarjetaKPIComponent } from "../../shared/tarjetaKPI/tarjetaKPI.component";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
import { CommonModule } from '@angular/common';
import { TarjetaCasoCriticoComponent } from '../../shared/tarjeta-caso-critico/tarjeta-caso-critico.component';
import { TarjetaCabeceraComponent } from "../../shared/tarjeta-cabecera/tarjeta-cabecera.component";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DashboardCoordinadorService } from './dashboard-coordinador.services';
import { SpinnerComponent } from './../../shared/spinner/spinner.component';

@Component({
  selector: 'app-dashboard-coordinador',
  templateUrl: './dashboard-coordinador.component.html',
  styleUrls: ['./dashboard-coordinador.component.css'],
  standalone: true,
  imports: [ChartModule, TarjetaKPIComponent, TarjetaCasoCriticoComponent, TarjetaCabeceraComponent, CommonModule, ReactiveFormsModule, SpinnerComponent],
})
export class DashboardCoordinadorComponent implements OnInit {

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

  nnaData: any;
  nnaOptions: any;
  seguimientosData: any;
  seguimientosOptions: any;
  llamadasData: any;
  llamadasOptions: any;
  alertasData: any;
  alertasOptions: any;

  cargado = false;

  constructor(public servicios: DashboardCoordinadorService, private fb: FormBuilder) {

    this.diasLimite(this.currentDate);
    this.formFechas = this.fb.group({
      fechaInicio: [this.fechaInicial],
      fechaFin: [this.fechaFinal]
    });

    Chart.register(ChartDataLabels);

  }

  async ngOnInit() {

    await this.dataBarra();

    await this.filtroFechas(this.fechaInicial, this.fechaFinal);



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

    let dataT1 = await this.servicios.GetTotalCasos(this.fechaInicial, this.fechaFinal, '');
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


  async onSubmit() {
    const fechaInicio = this.formFechas.value.fechaInicio;
    const fechaFin = this.formFechas.value.fechaFin;

    this.filtroFechas(fechaInicio, fechaFin);
  }

  async filtroFechas(fecha_inicial: any, fecha_final: any){

    this.cargado = false;

    let datos1 = await this.servicios.GetEntidadCantidad(fecha_inicial, fecha_final);

    const labels1 = datos1.map((d: { entidad: string }) => {
      return d.entidad;
    });

    const data1 = datos1.map((d: { cantidad: number }) => d.cantidad);


    this.nnaData = {
      labels: labels1,
      datasets: [
        {
          label: 'NNA',
          backgroundColor: '#73B7AD',
          borderColor: '#1E88E5',
          data: data1
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

    ///////////////////////////////////////////////////////////

    let parametrica  = await this.servicios.GetEstadoSeguimiento();
    let datos  = await this.servicios.GetEstadosSeguimientos(fecha_inicial, fecha_final, '');

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

    /////////////////////////////////////////////////////////////////
    let datos5 = await this.servicios.GetAgenteCantidad(fecha_inicial, fecha_final);

    const labels5 = datos5.map((d: { entidad: string }) => {
      // Convertir la fecha a formato 'YYYY-MM-DD' si es necesario
      return d.entidad;
    });

    const data5 = datos5.map((d: { cantidad: number }) => d.cantidad);

    this.llamadasData = {
      labels: labels5,
      datasets: [
        {
          label: 'Seguimientos',
          backgroundColor: '#73B7AD',
          borderColor: '#73B7AD',
          data: data5
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

    ///////////////////////////////////////////////////////////
     let parametrica4  = await this.servicios.GetEstadoAlerta();
     let datos4  = await this.servicios.GetEstadosAlertas(fecha_inicial, fecha_final, '');

     const totalCantidad = datos4.reduce((sum: any, item: { cantidad: any; }) => sum + item.cantidad, 0);
     console.log('totalCantidad ', totalCantidad);

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

    /////////////////////////////////////
    let infoCritica = await this.servicios.GetCasosCriticos(this.fechaInicial, this.fechaFinal);
console.log("infoCritica", infoCritica);

    let infoAlerta = await this.servicios.GetTpEstadoAlerta();

    let resultado = infoCritica.map((item: { alertaId: any; nombre: any; }) => {
      // Buscar en json2 el objeto con el id que coincide con el alertaId
      let coincidencia = infoAlerta.find((alerta: { id: any; }) => alerta.id === item.alertaId);

      // Si hay coincidencia, añadir el campo nombre al objeto de json1
      if (coincidencia) {
        item.nombre = coincidencia.nombre;
      }

      return item;
    });


    this.casosCriticos = resultado.sort((a: { alertaId: any; fechaSeguimiento: Date; }, b: { alertaId: any; fechaSeguimiento: Date; }) => {
      // Orden de prioridad por alertaId: 3 primero, luego 2, y el resto
      const prioridadAlertaId = (id: number) => (id === 3 ? 1 : id === 2 ? 2 : 3);

      const prioridadA = prioridadAlertaId(a.alertaId);
      const prioridadB = prioridadAlertaId(b.alertaId);

      if (prioridadA !== prioridadB) {
        return prioridadA - prioridadB;  // Primero se compara por la prioridad del alertaId
      }

      // Si tienen la misma prioridad, se ordenan por fechaSeguimiento (descendente)
      const fechaA = new Date(a.fechaSeguimiento).getTime();
      const fechaB = new Date(b.fechaSeguimiento).getTime();

      return fechaB - fechaA; // Orden descendente de fechas
    }).slice(0, 4);

    await this.agregarFullName();
     // Asigna los casos actualizados con fullName al array original


    this.cargado = true;
  }

  async agregarFullName() {
    // Mapeamos sobre el array de casosCriticos para obtener el fullName de cada agente
    const updatedCasos = await Promise.all(
      this.casosCriticos.map(async (caso: any) => {
        try {
          // Obtener info del usuario usando el AgenteSeguimiento
          const respuesta = await this.servicios.GetInfoUsuario(caso.agenteSeguimiento);

          // Añadir el campo fullName al objeto de casosCriticos
          caso.fullName = respuesta.fullName;
        } catch (error) {
          console.error(`Error obteniendo el fullName para el AgenteSeguimiento ${caso.AgenteSeguimiento}:`, error);
          // Puedes manejar el error o dejar el fullName vacío si ocurre un error
          caso.fullName = 'No disponible';
        }

        return caso;
      })
    );
    this.casosCriticos = updatedCasos;

    console.log(this.casosCriticos);

  }

}
