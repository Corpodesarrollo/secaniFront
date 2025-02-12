import { Injectable } from '@angular/core';
import { Generico } from '../core/services/generico';
import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class ReportesService {
  private urlbase: string = `${environment.url_MSSeguimiento}`;

  constructor(private generico: Generico) { }

  getReporteEstadoDepuracion(fechaInicial: string, fechaFinal: string) {
    const url: string = `Reportes/EstadoDepuracion?FechaInicial=${fechaInicial}&FechaFinal=${fechaFinal}`;
    return this.generico.retorno_get(url, this.urlbase);
  }

  getReporteDinamicoNNA(fechaInicial: string, fechaFinal: string) {
    const url: string = `Reportes/ReporteDinamicoNNA?FechaInicial=${fechaInicial}&FechaFinal=${fechaFinal}`;
    return this.generico.retorno_get(url, this.urlbase);
  }

  getReporteSeguimientos(fechaInicial: string, fechaFinal: string) {
    const url: string = `Reportes/ReporteDinamicoSeguimiento?FechaInicial=${fechaInicial}&FechaFinal=${fechaFinal}`;
    return this.generico.retorno_get(url, this.urlbase);
  }

  getReporteDetalleRegDepurados(idReporteDepuracion: string, tipoRegistro: number = 1) {
    const url: string = `Reportes/ReporteDetalleRegDepurados?IdReporteDepuracion=${idReporteDepuracion}&TipoRegistro=${tipoRegistro}`;
    return this.generico.retorno_get(url, this.urlbase);
  }

  getReporteDinamicosAlertas(fechaInicial: string, fechaFinal: string) {
    const url: string = `Reportes/ReporteDinamicoAlertas?FechaInicial=${fechaInicial}&FechaFinal=${fechaFinal}`;
    return this.generico.retorno_get(url, this.urlbase);
  }
}
