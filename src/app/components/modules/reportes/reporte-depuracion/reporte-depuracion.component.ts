import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

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
  selector: 'app-reporte-depuracion',
  standalone: true,
  imports: [ButtonModule, CalendarModule, CommonModule, ReactiveFormsModule, InputGroupAddonModule, InputGroupModule, InputTextModule, TableModule, RouterModule],
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
    }, { 
      validators: [FormUtils.validarFechas('fechaInicio', 'fechaFin')],
    });
  }

  ngOnInit(): void {}

  async onSubmit() {
    if (this.camposForm.invalid) return this.camposForm.markAllAsTouched();
    const { fechaInicio, fechaFin } = this.camposForm.value;

    const fechaInicialString = fechaInicio.toISOString().split('T')[0];
    const fechaFinalString = fechaFin.toISOString().split('T')[0];

    this.reportes = await this.reportesService.
      getReporteEstadoDepuracion(fechaInicialString, fechaFinalString);

    if (!this.reportes || (this.reportes && this.reportes.length == 0)) {
      this.reportes = this.generateFakeData().filter((reporte) => {
        return reporte.fecha >= fechaInicialString && reporte.fecha <= fechaFinalString;
      });
    }
  }

  exportExcel() {
    this.excelExportService.exportReporteToExcel(
      this.reportes, [], 'Reporte de depuración'
    );
  }

  private generateFakeData() {
    return [
      {
        id: 1,
        fecha: '2010-01-10',
        hora: '08:30:15.1234567',
        registrosIngresados: 30,
        registrosNuevos: 20,
        registrosDuplicados: 5,
        estado: '1'
      },
      {
        id: 2,
        fecha: '2012-03-15',
        hora: '14:45:25.6543210',
        registrosIngresados: 40,
        registrosNuevos: 35,
        registrosDuplicados: 3,
        estado: '1'
      },
      {
        id: 3,
        fecha: '2015-05-20',
        hora: '17:50:45.9876543',
        registrosIngresados: 70,
        registrosNuevos: 60,
        registrosDuplicados: 8,
        estado: '1'
      },
      {
        id: 4,
        fecha: '2017-09-30',
        hora: '10:10:30.1112131',
        registrosIngresados: 90,
        registrosNuevos: 80,
        registrosDuplicados: 15,
        estado: '1'
      },
      {
        id: 5,
        fecha: '2020-11-25',
        hora: '20:25:40.2223242',
        registrosIngresados: 100,
        registrosNuevos: 95,
        registrosDuplicados: 5,
        estado: '1'
      },
      {
        id: 6,
        fecha: '2023-06-15',
        hora: '12:35:50.3334343',
        registrosIngresados: 120,
        registrosNuevos: 110,
        registrosDuplicados: 10,
        estado: '1'
      },
      {
        id: 7,
        fecha: '2024-01-10',
        hora: '09:45:20.4445454',
        registrosIngresados: 150,
        registrosNuevos: 130,
        registrosDuplicados: 20,
        estado: '1'
      }
    ];
  }

}
