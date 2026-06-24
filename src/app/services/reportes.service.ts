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

  getReporteDetalleRegDepurados(idReporteDepuracion: string, tipoRegistro: number = 0) {
    const url: string = `Reportes/ReporteDetalleRegDepurados?IdReporteDepuracion=${idReporteDepuracion}&TipoRegistro=${tipoRegistro}`;
    return this.generico.get(url, '', 'Seguimiento');
  }

  getReporteDinamicoAlertas(fechaInicial: string, fechaFinal: string) {
    const fechas = this.convertirFechasEntrada(fechaInicial, fechaFinal);
    const url: string = `Reportes/ReporteDinamicoAlertas?FechaInicial=${fechas.fechaInicio}&FechaFinal=${fechas.fechaFin}`;
    return this.generico.get(url, '', 'Seguimiento');
  }
  
  getReporteDinamicoEAPB(data: any) {
    const fechas = this.convertirFechasEntrada(data.fechaInicio, data.fechaFin, 'mm-dd-yyyy');
    let url: string = `ReporteDinamicoEAPB?FechaInicial=${fechas.fechaInicio}&FechaFinal=${fechas.fechaFin}`;
    if (data.eapb) url += `&EAPB=${encodeURIComponent(data.eapb)}`;
    if (data.departamento) url += `&Departamento=${encodeURIComponent(data.departamento)}`;
    return this.generico.get(url, '', 'NNA');
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

  getReporteInconsistenciasGeneral(fechaInicial: string, fechaFinal: string) {
    const fechas = this.convertirFechasEntrada(fechaInicial, fechaFinal);
    const url: string = `ReporteInconsistenciaPersona/GetReporteInconsistencias?FechaInicio=${fechas.fechaInicio}&FechaFin=${fechas.fechaFin}`;
    return this.generico.get(url, '', 'NNA');
  }

  getReporteInconsistenciasPorNNA(nnaId: string) {
    const url: string = `ReporteInconsistenciaPersona/${nnaId}`;
    return this.generico.get(url, '', 'NNA');
  }

  marcarInconsistenciaResuelta(reporteId: number, userId?: string) {
    const url: string = `ReporteInconsistenciaPersona/${reporteId}/Resolver${userId ? `?userId=${userId}` : ''}`;
    return this.generico.put(url, {}, 'NNA');
  }

  getNNA() {
    const url: string = `NNA/ConsultarNNAFiltro`;
    return this.generico.post(url, { "estado": 0, "agente": "", "buscar": "", "orden": 1 }, 'NNA');
  }

  private formatearFecha(fechaISO: string, formato: 'dd-mm-yyyy'|'yyyy-mm-dd'|'mm-dd-yyyy' = 'yyyy-mm-dd'): string {
    if (!fechaISO) return '';
    
    const fecha = new Date(fechaISO);
    
    // Validar que la fecha sea válida
    if (isNaN(fecha.getTime())) {
      console.error('Fecha inválida:', fechaISO);
      return '';
    }
    
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    
    switch (formato.toLowerCase()) {
      case 'dd-mm-yyyy':
        return `${dia}-${mes}-${anio}`;
      case 'yyyy-mm-dd':
        return `${anio}-${mes}-${dia}`;
      case 'mm-dd-yyyy':
        return `${mes}-${dia}-${anio}`;
      default:
        console.warn(`Formato '${formato}' no reconocido. Usando formato por defecto yyyy-mm-dd`);
        return `${anio}-${mes}-${dia}`;
    }
  }

  private convertirFechasEntrada(fechaInicial: string, fechaFinal: string, formato: 'dd-mm-yyyy'|'yyyy-mm-dd'|'mm-dd-yyyy' = 'yyyy-mm-dd'): {fechaInicio: string, fechaFin: string} {
    return {
      fechaInicio: this.formatearFecha(fechaInicial, formato),
      fechaFin: this.formatearFecha(fechaFinal, formato)
    };
  }
}
