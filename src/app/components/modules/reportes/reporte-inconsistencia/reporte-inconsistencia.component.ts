import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

import { ReportesService } from '../../../../services/reportes.service';
import { ExcelExportService } from '../../../../services/excel-export.service';
import { FormUtils } from '../../../../utils/form-utils';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';

export enum TipoReporte {
  GENERAL = 'GENERAL',
  POR_NNA = 'POR_NNA'
}

@Component({
  selector: 'app-reporte-inconsistencia',
  standalone: true,
  imports: [CalendarModule, InputGroupAddonModule, InputGroupModule, DropdownModule, CommonModule, ButtonModule, InputTextModule, SelectButtonModule, ReactiveFormsModule, TableModule],
  templateUrl: './reporte-inconsistencia.component.html',
  styleUrl: './reporte-inconsistencia.component.css'
})
export class ReporteInconsistenciaComponent implements OnInit {
  public reportes: any[] = [];
  public camposForm!: FormGroup;

  public tipoReporte: TipoReporte = TipoReporte.GENERAL;
  public TipoReporte = TipoReporte;

  constructor(
    private fb: FormBuilder,
    private reportesService: ReportesService,
    private excelExportService: ExcelExportService
  ) { }

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

    this.reportesService.getReporteInconsistencias(fechaInicialString, fechaFinalString)
      .subscribe((reportes: any) => this.reportes = reportes);
  }

  exportExcel() {
    this.excelExportService.exportToExcel<any>(
      { rows: this.reportes, sheetName: `Reporte Inconsistencias` },
      'Reporte Inconsistencias',
    );
  }
}
