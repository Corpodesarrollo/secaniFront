import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { BotonNotificacionComponent } from '../../boton-notificacion/boton-notificacion.component';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { Seguimiento } from '../../../../models/seguimiento.model';
import { PaginatorModule } from 'primeng/paginator';
import { NNA } from '../../../../models/nna.model';

@Component({
  selector: 'app-casos-territorio',
  standalone: true,
  imports: [TableModule, BadgeModule, CardModule, CommonModule, BotonNotificacionComponent, RouterModule, DialogModule, PaginatorModule],
  templateUrl: './casos-territorio.component.html',
  styleUrls: ['./casos-territorio.component.css']
})
export class CasosTerritorioComponent implements OnInit {

  casos: any[] = [
    {"noCaso": 1,"fechaNotificacion": "2024-09-28 22:16:00.000", "nombreNnaCompleto": "Persona Perez Roa", "nombreEAPB": "Entidad_11", "nombreRegimenAfiliacion": "Subsidiado", "alertas": [{"id": 4, "nombre": "1.C"}], "observacion": "Obseraciones para el caso registrado", "respuesta": true},
    {"noCaso": 2,"fechaNotificacion": "2024-09-28 22:16:00.000", "nombreNnaCompleto": "Persona Perez Roa", "nombreEAPB": "Entidad_11", "nombreRegimenAfiliacion": "Subsidiado", "alertas": [{"id": 4, "nombre": "1.C"}], "observacion": "Obseraciones para el caso registrado", "respuesta": true},
    {"noCaso": 3,"fechaNotificacion": "2024-09-28 22:16:00.000", "nombreNnaCompleto": "Persona Perez Roa", "nombreEAPB": "Entidad_11", "nombreRegimenAfiliacion": "Subsidiado", "alertas": [{"id": 6, "nombre": "1.E"}], "observacion": "Obseraciones para el caso registrado", "respuesta": false},
    {"noCaso": 4,"fechaNotificacion": "2024-09-28 22:16:00.000", "nombreNnaCompleto": "Persona Perez Roa", "nombreEAPB": "Entidad_11", "nombreRegimenAfiliacion": "Subsidiado", "alertas": [{"id": 5, "nombre": "1.A"}], "observacion": "Obseraciones para el caso registrado", "respuesta": false},
    {"noCaso": 5,"fechaNotificacion": "2024-09-28 22:16:00.000", "nombreNnaCompleto": "Persona Perez Roa", "nombreEAPB": "Entidad_11", "nombreRegimenAfiliacion": "Subsidiado", "alertas": [{"id": 4, "nombre": "1.C"}], "observacion": "Obseraciones para el caso registrado", "respuesta": false}
  ];

  respuesta: any = {
    "infoAlerta": "1. Accesibilidad - 1.F.No tener implementado esquemas de diagnóstico",
    "para": "SECÁNI (secani_respuestas@minsalud.gov.co)",
    "conCopia": "María Eugenia Robledo (mrobledo@ins.go.co</a>)",
    "asunto": "RESPUESTA con resolución a alerta reportada",
    "mensaje": "RESPUESTA con resolución a alerta reportada",
    "firma": "EAPB\nDependencia alto costo\nTeléfono: 601 256 24 15\nwww.eapb.com.co",
    "adjuntos": {
      "nombre": "Nombre archivo adjunto.pdf",
      "archivoB64": "RXN0ZSBlcyB1biBhcmNoaXZvIGRlIGVqZW1wbG8gZW4gYmFzZTY0Lg=="
    }
  }

  visibleModalRta: boolean = false;

  constructor() { }

  ngOnInit() {
    //consltar casos por region
  }

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

  verRespuesta(noCaso: any){
    this.visibleModalRta = true;


  }

}
