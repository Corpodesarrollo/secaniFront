import { CommonModule, DatePipe, formatDate } from '@angular/common';
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
  styleUrl: './reporte-dinamico-alertas.component.css',
  providers: [DatePipe]
})
export class ReporteDinamicoAlertasComponent implements OnInit {
  reportes: ReporteDinamicoAlertas[] = [];
  camposForm!: FormGroup;

  columnasObligatorias: Columna<any>[] = [
    { header: 'Fecha notificación', field: 'fechaNotificacion' },
    { header: 'Fecha de resolución', field: 'fechaResolucion' },
    { header: 'Gestión de correos', field: 'correo' },
    { header: 'Nombres y apellidos NNA', field: 'primerNombre' },
    { header: 'Observación', field: 'observacion' }
  ];

  columnasOpcionales: Columna<any>[] = [
    { header: 'Nombre NNA', field: 'nombreNNA' },
    { header: 'EAPB', field: 'eapb' },
    { header: 'Categoría alerta', field: 'categoriaAlerta' },
    { header: 'Procesos con dificultad', field: 'procesosConDificultad' },
    { header: 'Edad NNA', field: 'edad' },
    { header: 'Correo electrónico', field: 'emailNNA' },
    { header: 'Subcategoria alerta', field: 'subCategoriaAlerta' },
    { header: 'Respuesta entidad', field: 'respuestaEntidad' },
    { header: 'Diagnóstico', field: 'diagnostico' },
    { header: 'Agente de seguimiento', field: 'agente' },
    { header: 'Estado', field: 'estadoAlerta' },
    { header: 'Fecha de respuesta entidad', field: 'fechaRespuesta' },
    { header: 'Sitio de residencia actual', field: 'residenciaActualDireccion' },
    { header: 'Por cuanto tiempo dejó de asistir', field: 'tratamientoCuantoTiemposinAsistir' },
    { header: 'Estudia actualmente', field: 'tratamientoEstudiaActualmente' },
    { header: 'Claridad de IPS y médicos del diagnóstico y tratamiento', field: 'claridadIpsMedicos' },
    { header: 'Quién asumió los costos de traslado', field: 'trasladosQuienAsumioCostosTraslado' },
    { header: 'Unidad de medida de tiempo', field: 'tratamientoUnidadMedidaTiempo' },
    { header: 'Ha dejado de asistir al colegio', field: 'tratamientoHaDejadodeAsistirColegio' },
    { header: 'Viáticos dan cobertura al traslado', field: 'viaticosCoberturaTraslado' },
    { header: 'Quién asumió los costos de la vivienda', field: 'costosVivienda' },
    { header: 'Causas de inasistencias', field: 'tratamientoCausasInasistencia' },
    { header: 'Tiempo de inasistencia al colegio', field: 'tratamientoTiempoInasistenciaColegio' },
    { header: 'Apoyo de fundaciones', field: 'apoyoFundaciones' },
    { header: 'Ha dejado de asistir al tratamiento', field: 'tratamientoHaDejadodeAsistir' },
    { header: 'Otra', field: 'tratamientoCausasInasistenciaOtra' },
    { header: 'Unidad de medida tiempo', field: 'unidadMedidaTiempoOtra' },
    { header: 'Nombre de la fundación', field: 'trasladosNombreFundacion' },
    { header: 'Tipo de seguimiento', field: 'tipoSeguimiento' },
    { header: 'Apoyo recibido por fundación', field: 'trasladosApoyoRecibidoxFundacion' } 
  ];

  constructor(
    private fb: FormBuilder,
    private reportesService: ReportesService,
    private excelExportService: ExcelExportService,
    private datePipe: DatePipe
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

  formatCell(value: any, field: string): string {
    if (this.isDateField(field) && value) {
      const date = new Date(value);
      return this.datePipe.transform(date, 'dd/MM/yyyy') ?? '';
    }

    if (typeof value === 'boolean') return value ? 'Sí' : 'No';
    return value ?? '';
  }

  private isDateField(field: string): boolean {
    return [
      'fechaNotificacion',
      'fechaResolucion',
      'fechaRespuesta',
      'fechaInicio',
      'fechaFin'
    ].includes(field);
  }

  onSubmit(): void {
    console.log(this.camposForm.value);
    if (this.camposForm.invalid) return this.camposForm.markAllAsTouched();
    const { fechaInicio, fechaFin } = this.camposForm.value;

    const fechaInicialString = new Date(fechaInicio).toISOString().split('T')[0];
    const fechaFinalString = new Date(fechaFin).toISOString().split('T')[0];

    this.reportesService.getReporteDinamicoAlertas(fechaInicialString, fechaFinalString)
      .subscribe((data: any) => this.reportes = data as ReporteDinamicoAlertas[]);
  }

  exportExcel() {
    this.excelExportService.exportToExcel<ReporteDinamicoAlertas>(
      { rows: this.reportes, columns: this.columnasParaMostrar, sheetName: `Reporte Dinamico Alertas` }, 
      'Reporte Dinamico Alertas',
    );
  }
}
