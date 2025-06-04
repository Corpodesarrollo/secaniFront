import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

import { FormUtils } from '../../../../utils/form-utils';
import { ReportesService } from '../../../../services/reportes.service';
import { ExcelExportService } from '../../../../services/excel-export.service';

@Component({
  selector: 'app-reporte-general-llamadas',
  standalone: true,
  imports: [ButtonModule, CalendarModule, CommonModule, InputGroupAddonModule, InputGroupModule, InputTextModule, ReactiveFormsModule, TableModule],
  templateUrl: './reporte-general-llamadas.component.html',
  styleUrl: './reporte-general-llamadas.component.css'
})
export class ReporteGeneralLlamadasComponent {
  public reportes: any[] = [];
  public camposForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private reportesService: ReportesService,
    private excelExportService: ExcelExportService
  ) {
    this.camposForm = this.formBuilder.group({
      buscador: [''], // Campo de búsqueda
      fechaInicio: ['', Validators.required], // Campo de fecha de inicio con validación requerida
      fechaFin: ['', Validators.required], // Campo de fecha de fin con validación requerida
    }, { 
      validators: [FormUtils.validarFechas('fechaInicio', 'fechaFin')],
    });
  }

  onSubmit() {
    console.log('SUBMIT');
    this.camposForm.markAllAsTouched();
    if (this.camposForm.invalid) return;
    
    console.log('SUBMIT2');
    const { fechaInicio, fechaFin } = this.camposForm.value;
    const fechaInicialString = fechaInicio.toISOString().split('T')[0];
    const fechaFinalString = fechaFin.toISOString().split('T')[0];

    console.log('SUBMIT3');
    this.reportesService.getReporteGeneralLlamadas(fechaInicialString, fechaFinalString)
      .subscribe((reportes: any) => {
        this.reportes = reportes;
        console.log(reportes);
      });
  }

  exportExcel() {
    this.excelExportService.exportReporteToExcel(
      this.reportes, [], 'Reporte general de Llamadas'
    );
  }
}
