import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CasosEntidadService } from './casos-entidad.services';


@Component({
  selector: 'app-casos-entidad',
  templateUrl: './casos-entidad.component.html',
  styleUrls: ['./casos-entidad.component.css'],
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule,
      CardModule, DialogModule, ButtonModule, TableModule, PaginatorModule, TagModule,  ]
})
export class CasosEntidadComponent implements OnInit {
  casos: any = {};
  displayModal: boolean = false;

  estadosSeguimiento = [];

  eapbID=1;
  epsID=1;

  constructor(public servicio: CasosEntidadService) { }

  async ngOnInit() {
    //TODO: IMPLEMENTAR LA FORMA EN QUE SE RECIBE EL ID DE EAPB Y EL EPS

    this.estadosSeguimiento = await this.servicio.GetEstadoSeguimiento();

    this.casos = await this.servicio.GetListaCasos(this.eapbID, this.epsID);
    console.log("casos ", this.casos);

    /*this.casos = [
      {
          "idCaso": 1,
          "fechaNotificacion": "2023-07-01",
          "nombreNNA": "Juan Pérez",
          "alerta": "Alta",
          "observaciones": "Caso de emergencia",
          "estado": "Abierto",
          "respuesta": "En proceso"
      },
      {
          "idCaso": 2,
          "fechaNotificacion": "2023-07-02",
          "nombreNNA": "María López",
          "alerta": "Media",
          "observaciones": "Necesita seguimiento",
          "estado": "Pendiente",
          "respuesta": "Asignado"
      },
      {
          "idCaso": 3,
          "fechaNotificacion": "2023-07-03",
          "nombreNNA": "Carlos García",
          "alerta": "Baja",
          "observaciones": "Requiere evaluación",
          "estado": "Cerrado",
          "respuesta": "Finalizado"
      },
      {
          "idCaso": 4,
          "fechaNotificacion": "2023-07-04",
          "nombreNNA": "Ana Torres",
          "alerta": "Alta",
          "observaciones": "Caso urgente",
          "estado": "En progreso",
          "respuesta": "En análisis"
      },
      {
          "idCaso": 5,
          "fechaNotificacion": "2023-07-05",
          "nombreNNA": "Luis Martínez",
          "alerta": "Media",
          "observaciones": "Consulta médica requerida",
          "estado": "Pendiente",
          "respuesta": "Esperando confirmación"
      }
  ]
 */

  }

  verRespuesta(){
    this.displayModal = true;
  }


  obtenerNombreEstadoSeguimiento(id: any){
    const selectedItem = this.estadosSeguimiento.find((item: { id: number; }) => item.id === id);
    let nombre = selectedItem ? selectedItem['nombre'] : '';
    return nombre;
  }

  getBadgeColor(estadoAlerta: any): string {
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

  valores(cadena: any){
    let arrayValores: string[] = cadena.split(',');
    return arrayValores;
  }

}
