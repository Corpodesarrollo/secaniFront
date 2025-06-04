import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

import { ReportesService } from '../../../../services/reportes.service';
import { ExcelExportService } from '../../../../services/excel-export.service';
import { FormUtils } from '../../../../utils/form-utils';

@Component({
  selector: 'app-reporte-detalle-nuevo-depurados',
  standalone: true,
  imports: [ButtonModule, CalendarModule, CommonModule, InputGroupAddonModule, InputGroupModule, InputTextModule, TableModule, ReactiveFormsModule],
  templateUrl: './reporte-detalle-nuevo-depurados.component.html',
  styleUrl: './reporte-detalle-nuevo-depurados.component.css'
})
export class ReporteDetalleNuevoDepuradosComponent {
  private id: string | null = null;

  public reportes: any[] = [];
  public filteredReportes: any[] = [];
  public camposForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private reportesService: ReportesService,
    private activatedRoute: ActivatedRoute,
    private excelExportService: ExcelExportService
  ) {
    this.camposForm = this.formBuilder.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
    }, { 
      validators: [FormUtils.validarFechas('fechaInicio', 'fechaFin')],
    });
  }

  async ngOnInit() {
    this.activatedRoute.paramMap.subscribe(async params => {
      this.id = params.get('id');
      if (this.id) {
        this.reportesService.getReporteDetalleRegDepurados(this.id)
          .subscribe((reportes: any) => this.reportes = reportes);
        this.filteredReportes = this.reportes;
      }
    });
  }

  onSubmit() {
    if (this.camposForm.invalid) return;
    const { fechaInicio, fechaFin } = this.camposForm.value;

    this.filteredReportes = this.reportes.filter(reporte => {
      const fechaNotificacion = new Date(reporte.fechaNotificacion);

      const fechaInicioValida = fechaInicio ? fechaNotificacion >= new Date(fechaInicio) : true;
      const fechaFinValida = fechaFin ? fechaNotificacion <= new Date(fechaFin) : true;

      return fechaInicioValida && fechaFinValida;
    });
  }

  exportExcel() {
    this.excelExportService.exportReporteToExcel(
      this.reportes, [], 'Reporte detalle nuevo depuración'
    );
  }
}
