import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { GenericService } from '../../../../../services/generic.services';
import { SeguimientoHistorial } from '../../../../../models/seguimientoHistorial.model';
import { NNA } from '../../../../../models/nna.model';
import { RespuestaEnviada } from '../../../../../models/respuestaEnviada.model';
import { ButtonModule } from 'primeng/button';
import { Seguimiento } from '../../../../../models/seguimiento.model';

@Component({
  selector: 'app-seguimiento-historial',
  standalone: true,
  imports: [TableModule, BadgeModule, CardModule, CommonModule, RouterModule, DialogModule, ButtonModule],
  templateUrl: './seguimiento-historial.component.html',
  styleUrl: './seguimiento-historial.component.css'
})
export class SeguimientoHistorialComponent {
  @Input() id!: number;
  seguimientos: Seguimiento[] = [];
  respuesta: RespuestaEnviada[] = [
    { 
      idCaso: 1, 
      idSeguimiento: 1, 
      nombreNNA: 'Francy Soler', 
      documentoNNA: 'R.C. 1026403512', 
      alertas: '1. Accesibilidad = 1.F. No tener implementados', 
      para: 'secanirespuesta@minsalud.comco', 
      conCopia: 'secanirespuesta@minsalud.comco', 
      asunto: 'RESPUESTA con resolución a alertareportado',
      mensaje: 'RESPUESTA con resolución a alertareportado',
      firma: 'EAPB Dependencia alto costo \n Responsable de la respuesta \n 1234567890', 
      adjuntos: 'oficio 1234 de 2021.pdf' 
    },
    {
      idCaso: 2,
      idSeguimiento: 2,
      nombreNNA: 'Camilo Romero',
      documentoNNA: 'R.C. 32456754',
      alertas: '1. Accesibilidad = 1.F. No tener implementados',
      para: 'secanirespuesta@minsalud.comco',
      conCopia: 'secanirespuesta@minsalud.comco',
      asunto: 'RESPUESTA con resolución a alertareportado',
      mensaje: 'RESPUESTA con resolución a alertareportado',
      firma: 'EAPB Dependencia alto costo \n Responsable de la respuesta \n 1234567890', 
      adjuntos: 'oficio 1234 de 2021.pdf' 
    }
  ];

  showDialog: boolean = false;
  isLoading = false;
  mensajeCarga: string = 'Cargando datos...';
  colorMensaje: string = 'text-primary';

  currentIndex: number = 0;
  currentRespueta: RespuestaEnviada | undefined;

  constructor(
    private repos: GenericService
  ) { }

  async ngOnInit(): Promise<void> {
    this.CargarDatos();
  }

  CargarDatos() {
    console.log("id", this.id);
    this.repos.get('Seguimiento/GetSeguimientosByNNA/', `${this.id}`, 'Seguimiento').subscribe({
      next: (data: any) => {
        this.seguimientos = data;
      }
    });
  }

  async cargarRespuestas(caso: number) {
    this.mensajeCarga = 'Cargando datos...';
    this.colorMensaje = 'text-primary';
    this.showDialog = true;
    this.isLoading = true;

    try {
      this.currentIndex = 0;
      if (this.respuesta.length > 0) {
        this.currentRespueta = this.respuesta[this.currentIndex];
      }

      this.repos.get('Seguimiento/GetRespuestas/', `${caso}`, 'Seguimiento').subscribe({
        next: (data: any) => {
          this.respuesta = data;

          if (this.respuesta.length > 0) {
            
            this.mensajeCarga = 'Datos cargados correctamente';
            this.colorMensaje = 'text-success';
            this.currentRespueta = this.respuesta[this.currentIndex];
          }
        }
      });
    } catch (error) {
      console.error("Error al cargar los datos", error);
      this.colorMensaje = 'text-danger';
      this.mensajeCarga = 'Error al cargar los datos';
    } finally {
      this.isLoading = false; 
    }
  }

  siguiente(): void {
    if (this.currentIndex < this.respuesta.length - 1) {
      this.currentIndex++;
      this.currentRespueta = this.respuesta[this.currentIndex];
    }
  }

  // Mover al registro anterior
  anterior(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.currentRespueta = this.respuesta[this.currentIndex];
    }
  }

  getBadgeColor(estadoAlerta: number): string {
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
}
