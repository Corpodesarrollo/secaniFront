import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ReportesService } from '../../../../services/reportes.service';
import { ExcelExportService } from '../../../../services/excel-export.service';

@Component({
  selector: 'app-reporte-depuracion',
  standalone: true,
  imports: [ButtonModule, CalendarModule, CommonModule, ReactiveFormsModule, InputGroupAddonModule, InputGroupModule, InputTextModule, TableModule],
  templateUrl: './reporte-depuracion.component.html',
  styleUrl: './reporte-depuracion.component.css'
})
export class ReporteDepuracionComponent implements OnInit {
  public reportes: any[] = [];
  public camposForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private reportesService: ReportesService,
    private excelExportService: ExcelExportService
  ) {
    this.camposForm = this.formBuilder.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  async onSubmit() {
    if (this.camposForm.invalid) return;
    const { fechaInicio, fechaFin } = this.camposForm.value;

    const fechaInicialString = fechaInicio.toISOString().split('T')[0];
    const fechaFinalString = fechaFin.toISOString().split('T')[0];

    this.reportes = await this.reportesService.
      getReporteEstadoDepuracion(fechaInicialString, fechaFinalString);
  }

  exportExcel() {
    this.excelExportService.exportReporteToExcel(
      this.reportes, [], 'Reporte de depuración'
    );
  }
}
