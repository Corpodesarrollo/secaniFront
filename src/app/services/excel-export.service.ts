import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Reporte } from '../models/reporte.model';
import { Alerta, NotificacionAlerta } from '../models/ExportConsutarAlertas.model';

export interface ExcelSheet<T = any> {
  rows: T[];
  sheetName: string;
  columns?: { header: string; field: keyof T }[];
}

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  exportToExcel<T>(sheet: ExcelSheet<T>, fileName = 'export') {
    const wb = XLSX.utils.book_new();
    const data = this.mapRowsWithColumns(sheet.rows, sheet.columns);
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, sheet.sheetName);

    const fileNameWithDate = `${this.sanitizeFileName(fileName)}_${this.getTimestamp()}.xlsx`;
    XLSX.writeFile(wb, fileNameWithDate);
  }

  exportToExcelMultipleSheets(sheets: ExcelSheet[], fileName = 'reporte') {
    const wb = XLSX.utils.book_new();

    sheets.forEach((sheet) => {
      const data = this.mapRowsWithColumns(sheet.rows, sheet.columns);
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, sheet.sheetName);
    });

    const fileNameWithDate = `${this.sanitizeFileName(fileName)}_${this.getTimestamp()}.xlsx`;
    XLSX.writeFile(wb, fileNameWithDate);
  }

  exportToExcelDesdeConsultarAlertas(alerta: Alerta, noCaso: string, nombreNNA: string): void {
    const wsData: any[][] = [];
    wsData.push([
      'Fecha Seguimiento',
      'Categoría',
      'Subcategoría',
      'Observación',
      'Estado',
      'Entidad notificada',
      'Fecha notificación',
      'Asunto notificación',
      'Fecha de respuesta'
    ]);

    const baseRow = [
      alerta.ultimaFechaSeguimiento ? new Date(alerta.ultimaFechaSeguimiento).toLocaleDateString() : '',
      alerta.categoriaAlerta || '',
      alerta.subcategoriaAlerta || '',
      alerta.observaciones || '',
      alerta.estadoId || ''
    ];

    alerta.notificacionesAlerta?.forEach((notificacion) => {
      const row = [
        ...baseRow,
        notificacion.entidadNotificada || '',
        notificacion.fechaNotificacion
          ? new Date(notificacion.fechaNotificacion).toLocaleDateString()
          : '',
        notificacion.asuntoNotificacion || '',
        notificacion.fechaRespuesta
          ? new Date(notificacion.fechaRespuesta).toLocaleDateString()
          : ''
      ];
      wsData.push(row);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    XLSX.utils.book_append_sheet(wb, ws, 'Alertas');

    XLSX.writeFile(wb, noCaso + ' - ' + nombreNNA +'.xlsx');
  }

  private mapRowsWithColumns<T>(rows: T[], columns?: { header: string; field: keyof T }[]): any[] {
    if (!columns || columns.length === 0) return rows;

    return rows.map((row) => {
      const mapped: any = {};
      columns.forEach((col) => {
        mapped[col.header] = row[col.field];
      });
      return mapped;
    });
  }

  private sanitizeFileName(name: string): string {
    return name.replace(/[\\/:*?"<>|]/g, '_');
  }

  private getTimestamp(): string {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const mi = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} -- ${hh}-${mi}-${ss}`;
  }
}
