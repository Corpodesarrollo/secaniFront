import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { GenericService } from './generic.services';
import { ReporteGeneralLlamadas } from '../models/reporteGeneralLlamadas';

@Injectable({providedIn: 'root'})
export class ReportesService {
  private urlbase: string = `${environment.url_MSSeguimiento}`;

  constructor(private generico: GenericService) { }

  getReporteEstadoDepuracion(fechaInicial: string, fechaFinal: string) {
    const fechas = this.convertirFechasEntrada(fechaInicial, fechaFinal);
    const url: string = `Reportes/EstadoDepuracion?FechaInicial=${fechas.fechaInicio}&FechaFinal=${fechas.fechaFin}`;
    return this.generico.get(url, '', 'Seguimiento');
  }

  getReporteDinamicoNNA(fechaInicial: string, fechaFinal: string) {
    const fechas = this.convertirFechasEntrada(fechaInicial, fechaFinal);
    const url: string = `Reportes/ReporteDinamicoNNA?FechaInicial=${fechas.fechaInicio}&FechaFinal=${fechas.fechaFin}`;
    return this.generico.get(url, '', 'Seguimiento');
  }

  getReporteSeguimientos(fechaInicial: string, fechaFinal: string) {
    const fechas = this.convertirFechasEntrada(fechaInicial, fechaFinal);
    const url: string = `Reportes/ReporteDinamicoSeguimiento?FechaInicial=${fechas.fechaInicio}&FechaFinal=${fechas.fechaFin}`;
    return this.generico.get(url, '', 'Seguimiento');
  }

  getReporteDetalleRegDepurados(idReporteDepuracion: string, tipoRegistro: number = 1) {
    const url: string = `Reportes/ReporteDetalleRegDepurados?IdReporteDepuracion=${idReporteDepuracion}&TipoRegistro=${tipoRegistro}`;
    return this.generico.get(url, '', 'Seguimiento');
  }

  getReporteDinamicoAlertas(fechaInicial: string, fechaFinal: string) {
    const fechas = this.convertirFechasEntrada(fechaInicial, fechaFinal);
    const url: string = `Reportes/ReporteDinamicoAlertas?FechaInicial=${fechas.fechaInicio}&FechaFinal=${fechas.fechaFin}`;
    return this.generico.get(url, '', 'Seguimiento');
  }
  
  getReporteDinamicoEAPB(data: any) {
    const fechas = this.convertirFechasEntrada(data.fechaInicial, data.fechaFinal);
    const newData = { ...data, fechaInicial: fechas.fechaInicio, fechaFinal: fechas.fechaFin }
    const url: string = `Reportes/ReporteCasosEAPB`;
    return this.generico.post(url, newData, 'Seguimiento');
  }
  
  getReporteGeneralLlamadas(fechaInicial: string, fechaFinal: string) {
    const fechas = this.convertirFechasEntrada(fechaInicial, fechaFinal);
    const url: string = `ReporteGeneralLlamadas/GetReporteGeneralLlamadas?FechaInicio=${fechas.fechaInicio}&FechaFin=${fechas.fechaFin}`;
    return this.generico.get(url, '', 'Seguimiento');
  }

  actualizarReporteGeneralLlamadas(id: number, observaciones: string) {
    const url: string = `ReporteGeneralLlamadas/ActualizarObservaciones/${id}`;
    return this.generico.put(url, { observacion: observaciones }, 'Seguimiento');
  }

  getReporteInconsistencias(fechaInicial: string, fechaFinal: string) {
    const fechas = this.convertirFechasEntrada(fechaInicial, fechaFinal);
    const url: string = `ReporteGeneralLlamadas/GetReporteGeneralLlamadas?FechaInicio=${fechas.fechaInicio}&FechaFin=${fechas.fechaFin}`;
    return this.generico.get(url, '', 'Seguimiento');
  }

  private formatearFecha(fechaISO: string): string {
    if (!fechaISO) return '';
    
    const fecha = new Date(fechaISO);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    
    return `${anio}-${mes}-${dia}`;
  }

  private convertirFechasEntrada(fechaInicial: string, fechaFinal: string): {fechaInicio: string, fechaFin: string} {
    return {
      fechaInicio: this.formatearFecha(fechaInicial),
      fechaFin: this.formatearFecha(fechaFinal)
    };
  }
}
