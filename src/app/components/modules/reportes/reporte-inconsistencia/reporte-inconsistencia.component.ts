import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';

import { ReportesService } from '../../../../services/reportes.service';
import { ExcelExportService } from '../../../../services/excel-export.service';
import { FormUtils } from '../../../../utils/form-utils';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ReporteInconsistenciaGeneral} from '../../../../models/reporteInconsistenciaGeneral';

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
  public reportesInconsistenciaNNA: any[] = [];
  public reportesInconsistenciaGeneral: ReporteInconsistenciaGeneral | null = null;
  public NNA: any[] = [];

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
      },
      {
        validators: [FormUtils.validarFechas('fechaInicio', 'fechaFin')],
      } as AbstractControlOptions
    );

    this.getNNA();
  }

  onSubmit() {
    if (this.camposForm.invalid) return this.camposForm.markAllAsTouched();

    const { fechaInicio, fechaFin } = this.camposForm.value;

    if (this.tipoReporte != TipoReporte.GENERAL) return;
    this.reportesService.getReporteInconsistenciasGeneral(fechaInicio, fechaFin)
      .subscribe({
        next: (reportes: any) => this.reportesInconsistenciaGeneral = reportes,
        error: (err) => console.error('Error fetching general report:', err)
      });
  }

  onNNAChange(event: any) {
    const selectedValue = event.value;
    this.getReporteNNA(selectedValue);
  }

  getReporteNNA(nnaId: string) {
    if (this.tipoReporte != TipoReporte.POR_NNA) return;
    this.reportesService.getReporteInconsistenciasPorNNA(nnaId)
      .subscribe({
        next: (reportes: any) => this.reportesInconsistenciaNNA = reportes,
        error: (err) => console.error('Error fetching general report:', err)
      });
  }

  getNNA() {
    this.reportesService.getNNA()
      .subscribe({
        next: (nna: any) => this.NNA = nna,
        error: (err) => console.error('Error fetching general report:', err)
      });
  }

  exportExcel() {
    this.excelExportService.exportToExcel<any>(
      { rows: this.reportesInconsistenciaNNA, sheetName: `Reporte Inconsistencias` },
      'Reporte Inconsistencias',
    );
  }
}
