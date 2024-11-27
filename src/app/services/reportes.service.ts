import { Injectable } from '@angular/core';
import { Generico } from '../core/services/generico';
import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class ReportesService {
  private urlbase: string = `${environment.url_MSSeguimiento}`;

  constructor(private generico: Generico) { }

  getReporteEstadoDepuracion() {
    const url: string = `ReportesSeguimiento/EstadoDepuracion`;
    return this.generico.retorno_get(url, this.urlbase);
  }

  getReporteDinamicoNNA(fechaInicial: string, fechaFinal: string) {
    const url: string = `ReportesSeguimiento/ReporteDinamicoNNA?FechaInicial=${fechaInicial}&FechaFinal=${fechaFinal}`;
    return this.generico.retorno_get(url, this.urlbase);
  }
}
