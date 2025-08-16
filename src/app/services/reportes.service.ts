import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { GenericService } from './generic.services';
import { ReporteGeneralLlamadas } from '../models/reporteGeneralLlamadas';

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

  getReporteDinamicoAlertas(fechaInicial: string, fechaFinal: string) {
    const url: string = `Reportes/ReporteDinamicoAlertas?FechaInicial=${fechaInicial}&FechaFinal=${fechaFinal}`;
    return this.generico.get(url, '', 'Seguimiento');
  }
  
  getReporteDinamicoEAPB(data: any) {
    const url: string = `Reportes/ReporteCasosEAPB`;
    return this.generico.post(url, data, 'Seguimiento');
  }
  
  getReporteGeneralLlamadas(fechaInicial: string, fechaFinal: string) {
    const url: string = `ReporteGeneralLlamadas/GetReporteGeneralLlamadas?FechaInicio=${fechaInicial}&FechaFin=${fechaFinal}`;
    return this.generico.get(url, '', 'Seguimiento');
  }

  actualizarReporteGeneralLlamadas(reporte: ReporteGeneralLlamadas) {
    const url: string = `ReporteGeneralLlamadas/ActualizarObservaciones`;
    return this.generico.put(url, reporte, 'Seguimiento');
  }

  getReporteInconsistencias(fechaInicial: string, fechaFinal: string) {
    const url: string = `ReporteGeneralLlamadas/GetReporteGeneralLlamadas?FechaInicio=${fechaInicial}&FechaFin=${fechaFinal}`;
    return this.generico.get(url, '', 'Seguimiento');
  }
}
