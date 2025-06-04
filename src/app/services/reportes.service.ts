import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { GenericService } from './generic.services';

@Injectable({providedIn: 'root'})
export class ReportesService {
  private urlbase: string = `${environment.url_MSSeguimiento}`;

  constructor(private generico: GenericService) { }

  getReporteEstadoDepuracion(fechaInicial: string, fechaFinal: string) {
    const url: string = `Reportes/EstadoDepuracion?FechaInicial=${fechaInicial}&FechaFinal=${fechaFinal}`;
    return this.generico.get(url, '', 'Seguimiento');
  }

  getReporteDinamicoNNA(fechaInicial: string, fechaFinal: string) {
    const url: string = `Reportes/ReporteDinamicoNNA?FechaInicial=${fechaInicial}&FechaFinal=${fechaFinal}`;
    return this.generico.get(url, '', 'Seguimiento');
  }

  getReporteSeguimientos(fechaInicial: string, fechaFinal: string) {
    const url: string = `Reportes/ReporteDinamicoSeguimiento?FechaInicial=${fechaInicial}&FechaFinal=${fechaFinal}`;
    return this.generico.get(url, '', 'Seguimiento');
  }

  getReporteDetalleRegDepurados(idReporteDepuracion: string, tipoRegistro: number = 1) {
    const url: string = `Reportes/ReporteDetalleRegDepurados?IdReporteDepuracion=${idReporteDepuracion}&TipoRegistro=${tipoRegistro}`;
    return this.generico.get(url, '', 'Seguimiento');
  }

  getReporteDinamicosAlertas(fechaInicial: string, fechaFinal: string) {
    const url: string = `Reportes/ReporteDinamicoAlertas?FechaInicial=${fechaInicial}&FechaFinal=${fechaFinal}`;
    return this.generico.get(url, '', 'Seguimiento');
  }
  
  getReporteGeneralLlamadas(fechaInicial: string, fechaFinal: string) {
    const url: string = `ReporteGeneralLlamadas/GetReporteGeneralLlamadas?FechaInicio=${fechaInicial}&FechaFin=${fechaFinal}`;
    return this.generico.get(url, '', 'Seguimiento');
  }
}
