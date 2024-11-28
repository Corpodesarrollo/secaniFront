import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Reporte } from '../models/reporte.model';

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

  exportReporteToExcel(reportes: Reporte[], columnas: { header: string, field: string }[], fileName: string = 'reporte') {
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
}
