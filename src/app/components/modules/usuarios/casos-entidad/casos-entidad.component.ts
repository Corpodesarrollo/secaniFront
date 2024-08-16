import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';


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


  constructor() { }

  ngOnInit() {
    //TODO: Consumir servicio que trae lista de casos en la
    this.casos = [
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


  }

  verRespuesta(){
    this.displayModal = true;
  }

}
