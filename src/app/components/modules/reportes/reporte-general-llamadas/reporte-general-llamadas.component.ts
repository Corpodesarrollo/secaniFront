import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
    private fb: FormBuilder,
    private reportesService: ReportesService,
    private excelExportService: ExcelExportService
  ) {}

  ngOnInit(): void {
    this.camposForm = this.fb.group(
      {
        fechaInicio: ['', Validators.required],
        fechaFin: ['', Validators.required],
        camposSeleccionados: this.fb.array([]),
      }, 
      {
        validators: [FormUtils.validarFechas('fechaInicio', 'fechaFin')],
      } as AbstractControlOptions
    );
  }

  onSubmit() {
    if (this.camposForm.invalid) return this.camposForm.markAllAsTouched();
    
    const { fechaInicio, fechaFin } = this.camposForm.value;
    const fechaInicialString = fechaInicio.toISOString().split('T')[0];
    const fechaFinalString = fechaFin.toISOString().split('T')[0];

    this.reportesService.getReporteGeneralLlamadas(fechaInicialString, fechaFinalString)
      .subscribe((reportes: any) => this.reportes = reportes);
  }

  exportExcel() {
    this.excelExportService.exportToExcel<any>(
      { rows: this.reportes, sheetName: `Reporte General de Llamadas` }, 
      'Reporte General de Llamadas',
    );
  }
}
