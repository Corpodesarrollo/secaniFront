import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

import { ReportesService } from '../../../../services/reportes.service';
import { ExcelExportService } from '../../../../services/excel-export.service';
import { FormUtils } from '../../../../utils/form-utils';
import { Columna } from '../../../../models/columna';
import { ReporteDinamicoAlertas } from '../../../../models/reporteDinamicoAlertas';

@Component({
  selector: 'app-reporte-dinamico-alertas',
  standalone: true,
  imports: [ButtonModule, CalendarModule, CheckboxModule, CommonModule, ReactiveFormsModule, InputGroupAddonModule, InputGroupModule, InputTextModule, TableModule],
  templateUrl: './reporte-dinamico-alertas.component.html',
  styleUrl: './reporte-dinamico-alertas.component.css'
})
export class ReporteDinamicoAlertasComponent implements OnInit {
  reportes: ReporteDinamicoAlertas[] = [];
  camposForm!: FormGroup;

  columnasObligatorias: Columna<ReporteDinamicoAlertas>[] = [
    { header: 'Fecha notificación', field: 'fechaNotificacion' },
    { header: 'Fecha de resolución', field: 'fechaResolucion' },
    { header: 'Gestión de correos', field: 'gestionCorreos' },
    { header: 'Nombres y apellidos NNA', field: 'nombresApellidos' },
    { header: 'Observación', field: 'observacion' }
  ];

  columnasOpcionales: Columna<ReporteDinamicoAlertas>[] = [
    { header: 'Nombre NNA', field: 'nombreNNA' },
    { header: 'EAPB', field: 'eapb' },
    { header: 'Categoría alerta', field: 'categoriaAlerta' },
    { header: 'Procesos con dificultad', field: 'procesosConDificultad' },
    { header: 'Edad NNA', field: 'edadNNA' },
    { header: 'Correo electrónico', field: 'correoElectronico' },
    { header: 'Subcategoria alerta', field: 'subcategoriaAlerta' },
    { header: 'Respuesta entidad', field: 'respuestaEntidad' },
    { header: 'Diagnóstico', field: 'diagnostico' },
    { header: 'Agente de seguimiento', field: 'agenteDeSeguimiento' },
    { header: 'Estado', field: 'estado' },
    { header: 'Fecha de respuesta entidad', field: 'fechaRespuestaEntidad' },
    { header: 'Sitio de residencia actual', field: 'sitioResidenciaActual' },
    { header: 'Por cuanto tiempo dejó de asistir', field: 'tiempoDejoAsistir' },
    { header: 'Estudia actualmente', field: 'estudiaActualmente' },
    { header: 'Claridad de IPS y médicos del diagnóstico y tratamiento', field: 'claridadIpsMedicos' },
    { header: 'Quién asumió los costos de traslado', field: 'costosTraslado' },
    { header: 'Unidad de medida de tiempo', field: 'unidadMedidaTiempo' },
    { header: 'Ha dejado de asistir al colegio', field: 'dejoAsistirColegio' },
    { header: 'Viáticos dan cobertura al traslado', field: 'viaticosCoberturaTraslado' },
    { header: 'Quién asumió los costos de la vivienda', field: 'costosVivienda' },
    { header: 'Causas de inasistencias', field: 'causasInasistencias' },
    { header: 'Tiempo de inasistencia al colegio', field: 'tiempoInasistenciaColegio' },
    { header: 'Apoyo de fundaciones', field: 'apoyoFundaciones' },
    { header: 'Ha dejado de asistir al tratamiento', field: 'dejoAsistirTratamiento' },
    { header: 'Otra', field: 'otra' },
    { header: 'Unidad de medida tiempo', field: 'unidadMedidaTiempoOtra' },
    { header: 'Nombre de la fundación', field: 'nombreFundacion' },
    { header: 'Tipo de seguimiento', field: 'tipoSeguimiento' },
    { header: 'Apoyo recibido por fundación', field: 'apoyoRecibidoFundacion' } 
  ];

  constructor(
    private fb: FormBuilder,
    private reportesService: ReportesService,
    private excelExportService: ExcelExportService
  ) {}

  ngOnInit(): void {
    this.camposForm = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      camposSeleccionados: this.fb.array([]),
    }, {
      validators: [FormUtils.validarFechas('fechaInicio', 'fechaFin')],
    } as AbstractControlOptions);
  }

  get camposSeleccionados(): FormArray {
    return this.camposForm.get('camposSeleccionados') as FormArray;
  }

  onCheckboxChange(event: any, columna: Columna<ReporteDinamicoAlertas>): void {
    const selected = this.camposSeleccionados;
    const index = selected.controls.findIndex(ctrl => ctrl.value.field === columna.field);

    if (event.checked && index === -1) {
      selected.push(new FormControl(columna));
    } else if (!event.checked && index !== -1) {
      selected.removeAt(index);
    }
  }

  get columnasParaMostrar(): Columna<ReporteDinamicoAlertas>[] {
    return [...this.columnasObligatorias, ...this.camposSeleccionados.value];
  }

  get columnasFiltroGlobal(): string[] {
    return this.columnasParaMostrar.map(col => col.field);
  }

  onSubmit(): void {
    if (this.camposForm.invalid) return this.camposForm.markAllAsTouched();
    const { fechaInicio, fechaFin } = this.camposForm.value;

    const fechaInicialString = new Date(fechaInicio).toISOString().split('T')[0];
    const fechaFinalString = new Date(fechaFin).toISOString().split('T')[0];

    this.reportesService.getReporteDinamicosAlertas(fechaInicialString, fechaFinalString)
      .subscribe((data: any) => this.reportes = data as any[]);
  }

  exportExcel() {
    this.excelExportService.exportToExcel<ReporteDinamicoAlertas>(
      { rows: this.reportes, columns: this.columnasParaMostrar, sheetName: `Reporte Dinamico Alertas` }, 
      'Reporte Dinamico Alertas',
    );
  }
}
