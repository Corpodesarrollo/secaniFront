import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { ReporteDetalleNuevoDepurados } from '../../../../models/reporteDetalleNuevoDepurados';

@Component({
  selector: 'app-reporte-detalle-nuevo-depurados',
  standalone: true,
  imports: [ButtonModule, CalendarModule, CommonModule, InputGroupAddonModule, InputGroupModule, InputTextModule, TableModule, ReactiveFormsModule],
  templateUrl: './reporte-detalle-nuevo-depurados.component.html',
  styleUrl: './reporte-detalle-nuevo-depurados.component.css'
})
export class ReporteDetalleNuevoDepuradosComponent {
  private id: string | null = null;

  public reportes: ReporteDetalleNuevoDepurados[] = [];
  public filteredReportes: ReporteDetalleNuevoDepurados[] = [];
  public camposForm!: FormGroup;
  public cargando: boolean = false;

  public fechaInicioRuta: string | null = null;
  public fechaFinRuta: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private reportesService: ReportesService,
    private activatedRoute: ActivatedRoute,
    private excelExportService: ExcelExportService,
    private router: Router
  ) {
    this.camposForm = this.formBuilder.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
    }, { 
      validators: [FormUtils.validarFechas('fechaInicio', 'fechaFin')],
    });
  }

  ngOnInit() {
    this.cargando = true;
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = params.get('id');
    
      if (this.id) {
        this.reportesService.getReporteDetalleRegDepurados(this.id)
          .subscribe({
            next: (response: any) => {
              this.reportes = response;
              this.filteredReportes = response;
              this.cargando = false;
            },
            error: (err) => {
              this.cargando = false;
            }
        });
      }
      this.cargando = false;
    });

    this.activatedRoute.queryParamMap.subscribe(queryParams => {
      this.fechaInicioRuta = queryParams.get('fechaInicio');
      this.fechaFinRuta = queryParams.get('fechaFin');
    });
  }

  onSubmit() {
    if (this.camposForm.invalid) return this.camposForm.markAllAsTouched();
    const { fechaInicio, fechaFin } = this.camposForm.value;
    
    this.cargando = true;
    this.filteredReportes = this.reportes.filter(reporte => {
      const fechaNotificacion = new Date(reporte.fechaNotificacion);

      const fechaInicioValida = fechaInicio ? fechaNotificacion >= new Date(fechaInicio) : true;
      const fechaFinValida = fechaFin ? fechaNotificacion <= new Date(fechaFin) : true;

      return fechaInicioValida && fechaFinValida;
    });
    this.cargando = false;
  }

  exportExcel() {
    this.excelExportService.exportToExcel<any>(
      { rows: this.reportes, sheetName: `Reporte Detalle Nuevo Depurados` }, 
      'Reporte Detalle Nuevo Depurados',
    );
  }

  volver() {
    this.router.navigate(['/reportes/depuracion_p115'], {
      queryParams: {
        fechaInicio: this.fechaInicioRuta,
        fechaFin: this.fechaFinRuta
      }
    });
  }
}
