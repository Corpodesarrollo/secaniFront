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
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-detalle-seguimientos',
  standalone: true,
  imports: [CommonModule, BadgeModule, CardModule, TableModule, RouterModule, InfoSeguimientoNnaComponent, BotonNotificacionComponent, EstadoNnaComponent, DialogModule, ButtonModule],
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

  // Bug 2026-06-17: el handler "respuestaEntidad" tiraba "Method not implemented" al click.
  // Mostramos un modal con la respuesta de la entidad de la fila.
  mostrarRespuesta: boolean = false;
  respuestaSeleccionada: any = null;

  constructor(
    private route: ActivatedRoute,
    private repos: GenericService,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.idSeguimiento = params.get('idSeguimiento') || '';
    });

    // BUG-LZ-088: el route param se llamaba idSeguimiento pero el codigo lo pasaba a
    // GetSeguimientosNNA (que espera NNAId) -> 0 filas -> pantalla en blanco al venir desde la
    // notificacion ("/gestion/detalle_seguimiento/{SeguimientoId}").
    // BUG 2026-06-17: el mismo route recibe ademas noCaso (=NNAId) desde consultar-seguimientos
    // (a [routerLink]). Si Seguimiento/{id} devuelve 404 tratamos el parametro como NNAId directo
    // en lugar de quedarnos con idNNA=0 (que hacia que el boton "Ver detalle NNA" navegara a
    // /usuarios/detalle_nna/0).
    this.repos.get(`Seguimiento/`, this.idSeguimiento, 'Seguimiento').subscribe({
      next: (seguimiento: any) => {
        const nnaId = seguimiento?.nNAId ?? seguimiento?.nnaId ?? seguimiento?.NNAId;
        this.cargarPorNNA(Number(nnaId || this.idSeguimiento));
      },
      error: (_err: any) => {
        this.cargarPorNNA(Number(this.idSeguimiento));
      }
    });
  }

  private cargarPorNNA(nnaId: number) {
    if (!nnaId || isNaN(nnaId)) {
      console.error('NNAId invalido para detalle_seguimiento', this.idSeguimiento);
      return;
    }
    this.idNNA = nnaId;
    this.repos.get(`Seguimiento/GetSeguimientosNNA/`, String(this.idNNA), 'Seguimiento').subscribe({
      next: (data: any) => {
        if (!data || data.length === 0) {
          console.warn('NNA sin seguimientos para mostrar', this.idNNA);
          return;
        }
        this.idSeguimientoX = data[0].idSeguimiento;
        this.seguimientos = data;
        this.datosNNA = data[0].nna;
        this.fechaInicio = new Date(this.datosNNA.fechaNacimiento);
        this.calcularTiempoTranscurrido();
      }
    });
  }

  // Bug 2026-06-17: backend devuelve DateTime.MinValue ("0001-01-01T00:00:00") cuando no
  // hay respuesta -> la tabla pintaba "01/01/0001". Devolvemos cadena vacia para esos casos.
  formatFechaRespuesta(value: any): string {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d.getTime()) || d.getFullYear() <= 1900) return '';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
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

  verRespuestaEntidad(seguimiento: any) {
    this.respuestaSeleccionada = seguimiento;
    this.mostrarRespuesta = true;
  }

  // Bug 2026-06-17: respuesta de la entidad vive por-alerta. Pasamos la alerta para
  // que el modal pinte la respuesta correcta.
  verRespuestaAlerta(alerta: any) {
    this.respuestaSeleccionada = {
      nombreEntidad: alerta?.entidadAlerta,
      fechaRespuesta: alerta?.fechaRespuesta,
      // Asunto real de RespuestasAlerta, no el nombre de la alerta (NombreAlerta=7.A).
      asunto: alerta?.asuntoRespuesta || alerta?.nombreAlerta,
      respuestaEntidad: alerta?.respuestaEntidad,
      archivoAdjunto: alerta?.archivoAdjuntoRespuesta
    };
    this.mostrarRespuesta = true;
  }

  async descargarAdjuntoRespuesta(nombreArchivo: string) {
    if (!nombreArchivo) return;
    try {
      const blob: any = await this.repos.getFile(`Storage/${nombreArchivo}`, '', 'Authentication');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = nombreArchivo;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error al descargar adjunto', err);
    }
  }

  cerrarRespuesta() {
    this.mostrarRespuesta = false;
    this.respuestaSeleccionada = null;
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
