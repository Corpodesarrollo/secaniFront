import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ActivatedRoute } from '@angular/router';
import { GenericService } from '../../../../services/generic.services';
import { RouterModule } from '@angular/router';
import { NNAInfoDiagnostico } from '../../../../models/nnaInfoDiagnostico.model';
import { InfoSeguimientoNnaComponent } from "../seguimientos/info-seguimiento-nna/info-seguimiento-nna.component";
import { BotonNotificacionComponent } from "../../boton-notificacion/boton-notificacion.component";

@Component({
  selector: 'app-detalle-seguimientos',
  standalone: true,
  imports: [CommonModule, BadgeModule, CardModule, TableModule, RouterModule, InfoSeguimientoNnaComponent, BotonNotificacionComponent],
  templateUrl: './detalle-seguimientos.component.html',
  styleUrl: './detalle-seguimientos.component.css'
})

export class DetalleSeguimientosComponent implements OnInit {
  seguimientos: any[] = [];
  idSeguimiento: string = "";
  idNNA: number = 0;
  datosNNA!: NNAInfoDiagnostico;

  fechaInicio!: Date; // Fecha de nacimiento
  fechaFin: Date = new Date(); // Fecha actual
  tiempoTranscurrido: string = '';

  constructor(
    private route: ActivatedRoute,
    private repos: GenericService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.idSeguimiento = params.get('idSeguimiento') || ''; // Recupera el valor del parámetro
      this.idNNA = Number(this.idSeguimiento);
    });
    console.log(this.idNNA);
    this.repos.get(`Seguimiento/GetSeguimientosNNA/`, this.idSeguimiento, 'Seguimiento').subscribe({
      next: (data: any) => {
        this.seguimientos = data;
        this.datosNNA = data[0].nna;
        this.fechaInicio = new Date(this.datosNNA.fechaNacimiento);
        this.calcularTiempoTranscurrido();
        console.log(this.seguimientos);
        console.log(this.datosNNA);
      }
    });
  }

  calcularTiempoTranscurrido() {
    if (!this.fechaInicio) {
      return;
    }

    const fechaInicio = new Date(this.fechaInicio);
    const fechaFin = new Date(this.fechaFin);

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

    this.tiempoTranscurrido = `${anos} años, ${meses} meses, ${dias} días`;
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

  respuestaEntidad() {
    throw new Error('Method not implemented.');
  }
}
