import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Reporte } from '../models/reporte.model';
import { Alerta, NotificacionAlerta } from '../models/ExportConsutarAlertas.model';

export interface TableData {
  data: any[];         // Datos de la tabla (filas)
  sheetName: string;   // Nombre de la hoja en Excel
}

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  exportToExcel(tableData: TableData, fileName: string = 'reporte') {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();  // Crear un nuevo libro de trabajo

    // Convertir los datos en una hoja de Excel
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(tableData.data);
    XLSX.utils.book_append_sheet(wb, ws, tableData.sheetName);

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    const formattedTime = `${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}-${now.getSeconds().toString().padStart(2, '0')}`;

    // Concatenar el nombre del archivo con la fecha y hora
    const finalFileName = `${fileName}_${formattedDate}_${formattedTime}.xlsx`;

    // Descargar el archivo Excel con el nuevo nombre
    XLSX.writeFile(wb, finalFileName);
  }

  exportReporteToExcel(reportes: Reporte[], columnas?: { header: string, field: string }[], fileName: string = 'reporte') {
    if (!reportes|| reportes.length === 0) return;
    if (!columnas || columnas.length === 0) return this.exportToExcel({ data: reportes, sheetName: 'Reporte' }, fileName);

    const datosExportar = reportes.map(reporte => {
      return columnas.reduce((acc, key) => {
        if (key.field in reporte) {
          acc[key.field] = reporte[key.field as keyof Reporte];  // Asegura que acceda a las claves correctamente
        }
        return acc;
      }, {} as { [key: string]: any });
    });

    this.exportToExcel({ data: datosExportar, sheetName: 'Reporte' }, fileName);
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






}
