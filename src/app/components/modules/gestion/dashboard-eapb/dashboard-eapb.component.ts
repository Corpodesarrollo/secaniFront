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
import { Router } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { User } from '../../../../core/services/user';

@Component({
  selector: 'app-dashboard-eapb',
  templateUrl: './dashboard-eapb.component.html',
  styleUrls: ['./dashboard-eapb.component.css'],
  standalone: true,
  imports: [ChartModule, TarjetaKPIComponent, TarjetaCasoCriticoComponent, TarjetaCabeceraComponent, CommonModule, SpinnerComponent, ReactiveFormsModule, CalendarModule],
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
  eapbId: any;
  xUser = new User();
  eapbResuelto: boolean = false;

  hoy = new Date();

  constructor( private fb: FormBuilder, public servicios: DashboardEapbService,  public router: Router) {

    // BUG-LZ-087: el eapbId estaba hardcoded a 2 -> el dashboard mostraba 0 alertas para cualquier
    // EAPB cuyo Id no fuera 2. Ahora se resuelve en ngOnInit via GetEAPBIdByNit(enterpriseIdentification).
    this.usuarioId = this.xUser.id ?? '';

    this.diasLimite(this.currentDate);
    this.formFechas = this.fb.group({
      fechaInicio: [this.fechaInicial],
      fechaFin: [this.fechaFinal]
    });

    Chart.register(ChartDataLabels);


  }

  diasLimite(currentDate: Date) {
    // HU SECANI-RQ07-HU01: rango por defecto = ultimo trimestre (90 dias) para
    // dinamizar las graficas. Antes era lunes-viernes de la semana actual.
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const f1 = new Date(currentDate);
    f1.setDate(currentDate.getDate() - 90);

    this.fechaInicial = formatDate(f1);
    this.fechaFinal = formatDate(currentDate);
  }



  async ngOnInit() {

    // BUG-LZ-087: resolver el TPEAPB.Id real desde el NIT del usuario (enterpriseIdentification)
    // antes de disparar cargas. Si no resuelve, no cargar el dashboard para no mostrar ceros falsos.
    const nit = this.xUser.enterpriseIdentification;
    if (nit) {
      try {
        const id = await this.servicios.GetEAPBIdByNit(nit);
        if (id) {
          this.eapbId = Number(id);
          this.eapbResuelto = true;
        }
      } catch (err) {
        console.error('No se pudo resolver EAPB Id por NIT', nit, err);
      }
    }

    if (!this.eapbResuelto) {
      console.warn('Dashboard EAPB: no se resolvio el Id de la entidad (NIT=' + nit + '). No se cargan contadores.');
      this.cargado = true;
      return;
    }

    await this.dataBarra();
    await this.filtroFechas(this.fechaInicial, this.fechaFinal);
  }


  async dataBarra(){
    let dataT1 = await this.servicios.GetTotalCasos(this.fechaInicial, this.fechaFinal);
    let dataP1 =  this.calculoPorcentaje(dataT1);

    this.data_1 = {
      imagen:1,
      titulo: 'Total Casos en Colombia',
      valor: dataT1.totalCasosGeneral,
      porcentaje: dataP1.toFixed(2)
    }

    let dataT2 = await this.servicios.GetRegistrosPropios(this.fechaInicial, this.fechaFinal, this.eapbId);
    let dataP2 =  this.calculoPorcentaje(dataT2);

    this.data_2 = {
      imagen:2,
      titulo: 'Registros propios',
      valor: dataT2.totalCasosGeneral,
      porcentaje: dataP2.toFixed(2)
    }

    let dataT3 = await this.servicios.GetTotalAlertasEAPB(this.fechaInicial, this.fechaFinal, this.eapbId);
    let dataP3 =  this.calculoPorcentaje(dataT3);

    this.data_3 = {
      imagen:3,
      titulo: 'Alertas',
      valor: dataT3.totalCasosGeneral,
      porcentaje: dataP3.toFixed(2)
    }


  }

  calculoPorcentaje(data: any){
    // HU SECANI-RQ07-HU01: porcentaje "aumento/disminucion" entre el periodo actual y
    // el anterior (semana vs semana, mes vs mes segun el KPI).
    let actual = Number(data?.totalCasosActual) || 0;
    let anterior = Number(data?.totalCasosAnterior) || 0;

    if (anterior > 0) return ((actual - anterior) / anterior) * 100;
    // Si no hubo periodo anterior y este aparecio, mostrar 100% para indicar incremento.
    return actual > 0 ? 100 : 0;
  }

  async filtroFechas(fecha_inicial: any, fecha_final: any){
    this.cargado = false;


    // HU SECANI-RQ07-HU01: pie "Alertas" usa CATEGORIA de la alerta, no estado.
    let parametrica4  = await this.servicios.GetCategoriaAlerta();

    let datos4  = await this.servicios.GetEstadosAlertasEAPB(fecha_inicial, fecha_final, this.eapbId);

    const totalCantidad = datos4.reduce((sum: any, item: { cantidad: any; }) => sum + item.cantidad, 0);
    console.log('totalCantidad ', totalCantidad)

   datos4 = datos4.map((item: { cantidad: number; }) => {
     return {
         ...item,
         porcentaje: ((item.cantidad / totalCantidad) * 100).toFixed(2) // Porcentaje con 2 decimales
     };
   });

    console.log('datos4 ', datos4)

    const backgroundColors2 = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0' , '#bbC0C0'];

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

   let datos  = await this.servicios.GetTiposCasos(fecha_inicial, fecha_final, this.eapbId);
   let dataGraf = [datos.conAlerta, datos.sinAlerta];


    // HU SECANI-RQ07-HU01: pie "Alertas abiertas vs cerradas" (datos.conAlerta y
    // datos.sinAlerta del backend ahora son AlertaSeguimientos con EstadoId != 5 y == 5
    // respectivamente, no NNAs con/sin alerta).
    this.alertasData2 = {
      labels: ['Abiertas', 'Cerradas'],
      datasets: [
        {
          data: dataGraf,
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


    //---------------------------------------

    this.alertas = await this.servicios.GetCasosCriticosEAPB(this.eapbId, fecha_inicial, fecha_final);

    this.alertas = this.asignarColorYBadge(this.alertas);

    this.alertas = this.alertas.sort((a: { alertaId: any; fechaSeguimiento: Date; }, b: { alertaId: any; fechaSeguimiento: Date; }) => {
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
    })


    // HU SECANI-RQ07-HU01: el tablero "Alertas Pendientes" muestra todas las alertas
    // pendientes de gestion (antes slice(0, 2) las recortaba arbitrariamente).
    this.cargado = true;
  }


  // HU SECANI-RQ07-HU01: edad simple en anios cumplidos a partir de fecha de nacimiento.
  calcularEdad(fechaNacimiento: any): number {
    if (!fechaNacimiento) return 0;
    const nac = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nac.getFullYear();
    const m = hoy.getMonth() - nac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
    return edad < 0 ? 0 : edad;
  }

  // HU SECANI-RQ07-HU01: tiempo desde que se creo la alerta (DateCreated) hasta hoy en dias.
  calcularDiasSinRespuesta(fechaCreacionAlerta: any): number {
    if (!fechaCreacionAlerta) return 0;
    const inicio = new Date(fechaCreacionAlerta).getTime();
    const hoy = Date.now();
    const dias = Math.floor((hoy - inicio) / (1000 * 60 * 60 * 24));
    return dias < 0 ? 0 : dias;
  }

  calcularTiempoTranscurrido(fech1: any, fech2: any) {


    const fechaInicio = new Date(fech1);
    const fechaFin = new Date(fech2);

    let anos = fechaFin.getFullYear() - fechaInicio.getFullYear();
    let meses = fechaFin.getMonth() - fechaInicio.getMonth();
    let dias = fechaFin.getDate() - fechaInicio.getDate();

    if (dias < 0) {
      meses--;
      const diasEnMes = new Date(fechaFin.getFullYear(), fechaFin.getMonth(), 0).getDate();
      dias += diasEnMes;
    }

    if (meses < 0) {
      anos--;
      meses += 12;
    }

    return  `${anos} años, ${meses} meses, ${dias} días`;
  }


  asignarColorYBadge(casos: any[]) {
    return casos.map(caso => {
      if (caso.alertaId == 2) {
        caso.color = '#FF9801';
        caso.badge = 'warning';
      } else if (caso.alertaId == 3) {
        caso.color = '#EC2121';
        caso.badge = 'danger';
      } else {
        // Valores por defecto
        caso.color = '#000000';
        caso.badge = 'default';
      }
      return caso;
    });
  }


  verTodosCasosCriticos(){
    // Bug 2026-06-17: PO solicita que "Ver todas" navegue al modulo de gestion de alertas.
    this.router.navigate(['/gestionar-alertas']);
  }

  // HU SECANI-RQ07-HU01: "Ver" debe navegar a HU03 (gestionar-alertas) filtrado por la
  // alerta seleccionada (no abrir modal Notificacion como hacia el patch del 2026-06-17).
  abrirNotificacion(alertaId: number) {
    this.router.navigate(['/gestionar-alertas'], { queryParams: { alertaId } });
  }

  async consultar() {
    // Obtén los valores de las fechas del formulario
    const fechaInicioValue = this.formFechas.get('fechaInicio')?.value;
    const fechaFinValue = this.formFechas.get('fechaFin')?.value;

    // Convierte los valores a objetos Date
    const fechaInicio: Date = new Date(fechaInicioValue);
    const fechaFin: Date = new Date(fechaFinValue);

    // Asegúrate de que las fechas sean válidas antes de continuar
    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
      console.error("Una o ambas fechas no son válidas");
      return;
    }

    // Extrae año, mes y día para formar las cadenas en el formato deseado
    const year = fechaInicio.getFullYear();
    const month = ('0' + (fechaInicio.getMonth() + 1)).slice(-2); // Añadir 1 al mes ya que empieza desde 0
    const day = ('0' + fechaInicio.getDate()).slice(-2);

    const fechaInicioForma = `${year}-${month}-${day}`;

    const year2 = fechaFin.getFullYear();
    const month2 = ('0' + (fechaFin.getMonth() + 1)).slice(-2);
    const day2 = ('0' + fechaFin.getDate()).slice(-2);

    const fechaFinForma = `${year2}-${month2}-${day2}`;

    // Imprime las fechas formateadas
    //console.log("Las fechas ", fechaInicioForma, fechaFinForma);

    // Llama a la función filtroFechas con las fechas formateadas
    await this.filtroFechas(fechaInicioForma, fechaFinForma);
  }


  enviarDatoNNa(nnaId: number){
    const fechaInicioValue = this.formFechas.value.fechaInicio;
    const fechaFinValue = this.formFechas.value.fechaFin;

    // Convierte los valores a objetos Date
    const fechaInicioT: Date = new Date(fechaInicioValue);
    const fechaFinT: Date = new Date(fechaFinValue);

    // Asegúrate de que las fechas sean válidas antes de continuar
    if (isNaN(fechaInicioT.getTime()) || isNaN(fechaFinT.getTime())) {
      console.error("Una o ambas fechas no son válidas");
      return;
    }

    // Extrae año, mes y día para formar las cadenas en el formato deseado
    const year = fechaInicioT.getFullYear();
    const month = ('0' + (fechaInicioT.getMonth() + 1)).slice(-2); // Añadir 1 al mes ya que empieza desde 0
    const day = ('0' + fechaInicioT.getDate()).slice(-2);

    const fechaInicio = `${year}-${month}-${day}`;

    const year2 = fechaFinT.getFullYear();
    const month2 = ('0' + (fechaFinT.getMonth() + 1)).slice(-2);
    const day2 = ('0' + fechaFinT.getDate()).slice(-2);

    const fechaFin = `${year2}-${month2}-${day2}`;

    // Imprime las fechas formateadas
    //console.log("Las fechas ", fechaInicioForma, fechaFinForma);

    //this.router.navigate(['/gestion/seguimientos'], { queryParams: { fechaInicio, fechaFin } });
    this.router.navigate(['/casos-entidad'], { queryParams: { fechaInicio, fechaFin, nnaId  } });
  }

}
