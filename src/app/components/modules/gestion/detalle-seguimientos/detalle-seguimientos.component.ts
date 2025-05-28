import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ActivatedRoute } from '@angular/router';
import { GenericService } from '../../../../services/generic.services';
import { RouterModule, Router } from '@angular/router';
import { NNAInfoDiagnostico } from '../../../../models/nnaInfoDiagnostico.model';
import { InfoSeguimientoNnaComponent } from "../seguimientos/info-seguimiento-nna/info-seguimiento-nna.component";
import { BotonNotificacionComponent } from "../../boton-notificacion/boton-notificacion.component";
import { EstadoNnaComponent } from "../../estado-nna/estado-nna.component";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { SeguimientoDetalle } from '../../../../models/seguimientoDetalle.model';
import { ExpDetallSeguimientoModel } from '../../../../models/expDetallSeguimientoModel.model';

@Component({
  selector: 'app-detalle-seguimientos',
  standalone: true,
  imports: [CommonModule, BadgeModule, CardModule, TableModule, RouterModule, InfoSeguimientoNnaComponent, BotonNotificacionComponent, EstadoNnaComponent],
  templateUrl: './detalle-seguimientos.component.html',
  styleUrl: './detalle-seguimientos.component.css'
})

export class DetalleSeguimientosComponent implements OnInit {
  seguimientos: SeguimientoDetalle[] = [];
  idSeguimiento: string = "";
  idSeguimientoX: string = "";
  idNNA: number = 0;
  datosNNA: NNAInfoDiagnostico = {
    nombreCompleto: '',
    fechaNacimiento: '',
    diagnostico: '',
    idEstado: 0
  };

  fechaInicio!: Date; // Fecha de nacimiento
  fechaFin: Date = new Date(); // Fecha actual
  tiempoTranscurrido: string = '';

  constructor(
    private route: ActivatedRoute,
    private repos: GenericService,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.idSeguimiento = params.get('idSeguimiento') || ''; // Recupera el valor del parámetro
      this.idNNA = Number(this.idSeguimiento);
    });
    console.log(this.idNNA);
    this.repos.get(`Seguimiento/GetSeguimientosNNA/`, this.idSeguimiento, 'Seguimiento').subscribe({
      next: (data: any) => {
        this.idSeguimientoX = data[0].idSeguimiento;
        this.seguimientos = data;
        this.datosNNA = data[0].nna;
        this.fechaInicio = new Date(this.datosNNA.fechaNacimiento);
        this.calcularTiempoTranscurrido();
        console.log("Datos Seguimiento: ", this.seguimientos);
        console.log("Datos NNA: ", this.datosNNA);
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

  intentosLlamada(id: number) {
    this.router.navigate(['/intento-seguimiento'], { state: { id_seguimiento: id } });
  }

  respuestaEntidad() {
    throw new Error('Method not implemented.');
  }

  descargarPDFSeguimiento(): void {
    const url = `${environment.url_MSSeguimiento}Seguimiento/ExportarDetalleSeguimiento/${this.idSeguimientoX}`;

    this.http.get<ExpDetallSeguimientoModel>(url).subscribe(response => {
      const base64 = response.result?.base64 || '';

      const byteCharacters = atob(base64); // Decodifica Base64
      const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = 'detalle-seguimiento.pdf';
      a.click();
      URL.revokeObjectURL(blobUrl);
    });
  }
}
