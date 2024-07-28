import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { Seguimiento } from '../../../models/seguimiento.model';
import { CommonModule } from '@angular/common';
import { BotonNotificacionComponent } from "../boton-notificacion/boton-notificacion.component";

@Component({
  selector: 'app-consultar-seguimientos',
  standalone: true,
  imports: [TableModule, BadgeModule, CardModule, CommonModule, BotonNotificacionComponent ],
  templateUrl: './consultar-seguimientos.component.html',
  styleUrl: './consultar-seguimientos.component.css',
  encapsulation: ViewEncapsulation.None
})

export class ConsultarSeguimientosComponent implements OnInit {

  seguimientos: Seguimiento[] = [
    { idCaso: 10026,
      fechaNotificacion: new Date('2024-04-15'),
      nombre: 'Juan Pérez López',
      estado: {
        id: 2,
        estadoNNA: 'En proceso',
        descripcion: 'El caso se encuentra en proceso de investigación',
        colorBG: '#cce5ff',
        colorText: '#004085'
      },
      asuntoUltimaActuacion: 'Entrevista con el menor',
      ultimaActuacion: new Date('2024-04-10'),
      alertas: [
        {
          id: 3, 
          alertaId: 3, 
          alerta: {
            id: 3,
            subcategoriaId: 1,
            subcategoria: { 
              id: 1,
              subcategoriaAlerta: "No contar o demorar la autorización integral para la atención de los menores de 18 años con cáncer.",
              categoriaAlertaId: 1,
              indicador: "A" },
            descripcion: 'El menor presenta signos de maltrato físico',
            alias: 'Maltrato físico'
          }, seguimientoId: 10026, observaciones: 'El menor no se encuentra en el domicilio', estadoId: 1, estado: { id: 1, estadoAlerta: 'Identificada' }, ultimaFechaSeguimiento: new Date('2024-04-11'),
        },
        {
          id: 4, 
          alertaId: 4, 
          alerta: {
            id: 4,
            subcategoriaId: 2,
            subcategoria: { 
              id: 2,
              subcategoriaAlerta: "No contar con el consentimiento informado del paciente o tutor para la atención de los menores de 18 años con cáncer.",
              categoriaAlertaId: 1,
              indicador: "B" },
            descripcion: 'El menor presenta signos de maltrato psicológico',
            alias: 'Maltrato psicológico'
          }, seguimientoId: 10026, observaciones: 'El menor ha sido localizado', estadoId: 2, estado: { id: 4, estadoAlerta: 'Resuelta' }, ultimaFechaSeguimiento: new Date('2024-04-12'),
        }
      ]
    },
    { idCaso: 10027,
      fechaNotificacion: new Date('2024-04-15'),
      nombre: 'María González Pérez',
      estado: {
        id: 1,
        estadoNNA: 'Identificado',
        descripcion: 'El caso ha sido identificado y se encuentra en proceso de investigación',
        colorBG: '#f8d7da',
        colorText: '#721c24'
      },
      asuntoUltimaActuacion: 'Entrevista con el menor',
      ultimaActuacion: new Date('2024-04-10'),
      alertas: [
        {
          id: 5, 
          alertaId: 5, 
          alerta: {
            id: 5,
            subcategoriaId: 3,
            subcategoria: { 
              id: 3,
              subcategoriaAlerta: "No contar con el consentimiento informado del paciente o tutor para la atención de los menores de 18 años con cáncer.",
              categoriaAlertaId: 1,
              indicador: "C" },
            descripcion: 'El menor presenta signos de maltrato sexual',
            alias: 'Maltrato sexual'
          }, seguimientoId: 10027, observaciones: 'El menor no se encuentra en el domicilio', estadoId: 3, estado: { id: 3, estadoAlerta: 'En proceso' }, ultimaFechaSeguimiento: new Date('2024-04-11'),
        },
        {
          id: 6, 
          alertaId: 6, 
          alerta: {
            id: 6,
            subcategoriaId: 4,
            subcategoria: { 
              id: 4,
              subcategoriaAlerta: "No contar con el consentimiento informado del paciente o tutor para la atención de los menores de 18 años con cáncer.",
              categoriaAlertaId: 1,
              indicador: "D" },
            descripcion: 'El menor presenta signos de maltrato emocional',
            alias: 'Maltrato emocional'
          }, seguimientoId: 10027, observaciones: 'El menor ha sido localizado', estadoId: 4, estado: { id: 4, estadoAlerta: 'Resuelta' }, ultimaFechaSeguimiento: new Date('2024-04-12'),
        }
      ]
    },
    { idCaso: 10028,
      fechaNotificacion: new Date('2024-04-15'),
      nombre: 'José Ramírez Pérez',
      estado: {
        id: 3,
        estadoNNA: 'En proceso',
        descripcion: 'El caso se encuentra en proceso de investigación',
        colorBG: '#f8d7da',
        colorText: '#721c24'
      },
      asuntoUltimaActuacion: 'Entrevista con el menor',
      ultimaActuacion: new Date('2024-04-10'),
      alertas: [
        {
          id: 7, 
          alertaId: 7, 
          alerta: {
            id: 7,
            subcategoriaId: 5,
            subcategoria: { 
              id: 5,
              subcategoriaAlerta: "No contar con el consentimiento informado del paciente o tutor para la atención de los menores de 18 años con cáncer.",
              categoriaAlertaId: 1,
              indicador: "E" },
            descripcion: 'El menor presenta signos de maltrato físico',
            alias: 'Maltrato físico'
          }, seguimientoId: 10028, observaciones: 'El menor no se encuentra en el domicilio', estadoId: 1, estado: { id: 1, estadoAlerta: 'Identificada' }, ultimaFechaSeguimiento: new Date('2024-04-11'),
        },
        {
          id: 8, 
          alertaId: 8, 
          alerta: {
            id: 8,
            subcategoriaId: 6,
            subcategoria: { 
              id: 6,
              subcategoriaAlerta: "No contar con el consentimiento informado del paciente o tutor para la atención de los menores de 18 años con cáncer.",
              categoriaAlertaId: 1,
              indicador: "F" },
            descripcion: 'El menor presenta signos de maltrato psicológico',
            alias: 'Maltrato psicológico'
          }, seguimientoId: 10028, observaciones: 'El menor ha sido localizado', estadoId: 2, estado: { id: 4, estadoAlerta: 'Resuelta' }, ultimaFechaSeguimiento: new Date('2024-04-12'),
        }
      ]
    }

  ];

  constructor() { }

  ngOnInit(): void { }

  getBadgeColor(estadoAlerta: number): string {
    switch (estadoAlerta) {
      case 4: // Resuelta
        return 'bg-success'; // Verde
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
}
