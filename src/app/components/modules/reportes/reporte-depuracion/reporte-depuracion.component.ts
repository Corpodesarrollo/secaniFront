import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

import { ReportesService } from '../../../../services/reportes.service';
import { ExcelExportService } from '../../../../services/excel-export.service';
import { FormUtils } from '../../../../utils/form-utils';
import { ReporteDepuracion } from '../../../../models/reporteDepuracion';

@Component({
  selector: 'app-reporte-depuracion',
  standalone: true,
  imports: [ButtonModule, CalendarModule, CommonModule, ReactiveFormsModule, InputGroupAddonModule, InputGroupModule, InputTextModule, TableModule, RouterModule],
  templateUrl: './reporte-depuracion.component.html',
  styleUrl: './reporte-depuracion.component.css'
})
export class ReporteDepuracionComponent implements OnInit {
  public reportes: ReporteDepuracion[] = [];
  public camposForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private reportesService: ReportesService,
    private excelExportService: ExcelExportService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.camposForm = this.formBuilder.group(
      {
        fechaInicio: ['', Validators.required],
        fechaFin: ['', Validators.required],
      },
      {
        validators: [FormUtils.validarFechas('fechaInicio', 'fechaFin')],
      } as AbstractControlOptions
    );

    this.route.queryParams.subscribe((params) => {
    const fechaInicio = params['fechaInicio'];
    const fechaFin = params['fechaFin'];

    if (fechaInicio && fechaFin) {
      this.camposForm.patchValue({
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin),
      });
      this.onSubmit();
    }
  });
  }

  onSubmit() {
    if (this.camposForm.invalid) return this.camposForm.markAllAsTouched();
    const { fechaInicio, fechaFin } = this.camposForm.value;
    if (!fechaInicio || !fechaFin) return;
    
    const fechaInicialString = new Date(fechaInicio).toISOString().split('T')[0];
    const fechaFinalString = new Date(fechaFin).toISOString().split('T')[0];

    this.reportesService.getReporteEstadoDepuracion(fechaInicialString, fechaFinalString)
    .subscribe((reportes: any) => {
      this.reportes = reportes.map((reporte: any) => {
        switch (String(reporte.estado)) {
          case '1': return { ...reporte, estado: 'Procesado' };
          case '2': return { ...reporte, estado: 'Fallido' };
          default: return reporte;
        }
      });
    });
  }

  exportExcel() {
    this.excelExportService.exportToExcel<ReporteDepuracion>(
      { rows: this.reportes, sheetName: `Reporte_Depuracion` }, 
      'Reporte Depuración',
    );
  }

}
