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
import { PermisoDirective } from '../../../../directives/permiso.directive';

@Component({
  selector: 'app-reporte-dinamico-alertas',
  standalone: true,
  imports: [ButtonModule, CalendarModule, CheckboxModule, CommonModule, ReactiveFormsModule, InputGroupAddonModule, InputGroupModule, InputTextModule, TableModule, PermisoDirective],
  templateUrl: './reporte-dinamico-alertas.component.html',
  styleUrl: './reporte-dinamico-alertas.component.css',
  providers: [DatePipe]
})
export class ReporteDinamicoAlertasComponent implements OnInit {
  public reportes: ReporteDinamicoAlertas[] = [];
  public camposForm!: FormGroup;
  public cargando: boolean = false;

  public columnasObligatorias: Columna<any>[] = [
    { header: 'Fecha notificación', field: 'fechaNotificacion' },
    { header: 'Fecha de resolución', field: 'fechaResolucion' },
    { header: 'Gestión de correos', field: 'cuidadorEmail' },
    { header: 'Nombres y apellidos NNA', field: 'nombreCompleto' },
    { header: 'Observación', field: 'observacion' }
  ];

  public columnasOpcionales: Columna<any>[] = [
    { header: 'EAPB', field: 'eps' },
    { header: 'Categoría alerta', field: 'categoriaAlerta' },
    { header: 'Edad NNA', field: 'edad' },
    { header: 'Correo electrónico', field: 'cuidadorEmail' },
    { header: 'Subcategoria alerta', field: 'subCategoriaAlerta' },
    { header: 'Respuesta entidad', field: 'respuestaEntidad' },
    { header: 'Diagnóstico', field: 'diagnostico' },
    { header: 'Agente de seguimiento', field: 'agente' },
    { header: 'Estado', field: 'estadoAlerta' },
    { header: 'Fecha de respuesta entidad', field: 'fechaRespuesta' },
    { header: 'Sitio de residencia actual', field: 'residenciaActualDireccion' },
    { header: 'Por cuanto tiempo dejó de asistir', field: 'tratamientoCuantoTiemposinAsistir' },
    { header: 'Estudia actualmente', field: 'tratamientoEstudiaActualmente' },
    { header: 'Claridad de IPS y médicos del diagnóstico y tratamiento', field: 'tratamientoHaSidoInformadoClaramente' },
    { header: 'Quién asumió los costos de traslado', field: 'trasladosQuienAsumioCostosTraslado' },
    { header: 'Unidad de medida de tiempo', field: 'tratamientoUnidadMedidaTiempo' },
    { header: 'Ha dejado de asistir al colegio', field: 'tratamientoHaDejadodeAsistirColegio' },
    { header: 'Quién asumió los costos de la vivienda', field: 'trasladosQuienAsumioCostosVivienda' },
    { header: 'Causas de inasistencias', field: 'tratamientoCausasInasistencia' },
    { header: 'Tiempo de inasistencia al colegio', field: 'tratamientoTiempoInasistenciaColegio' },
    { header: 'Apoyo de fundaciones', field: 'trasladosHaSolicitadoApoyoFundacion' },
    { header: 'Ha dejado de asistir al tratamiento', field: 'tratamientoHaDejadodeAsistir' },
    { header: 'Otra causa de inasistencia', field: 'tratamientoCausasInasistenciaOtra' },
    { header: 'Unidad de medida tiempo inasistencia colegio', field: 'tratamientoTiempoInasistenciaUnidadMedida' },
    { header: 'Nombre de la fundación', field: 'trasladosNombreFundacion' },
    { header: 'Tipo de seguimiento', field: 'tipoSeguimiento' },
    { header: 'Apoyo recibido por fundación', field: 'trasladosApoyoRecibidoxFundacion' },
    { header: 'Trasladado de institución', field: 'trasladosHaSidoTrasladadodeInstitucion' },
    { header: 'Cantidad de notificaciones', field: 'notificaciones' }
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

    // p-checkbox PrimeNG con [value] sin ngModel emite event.checked como array
    // de valores activos. Toggle: si ya esta lista -> quitar, si no -> agregar.
    if (index === -1) {
      selected.push(new FormControl(columna));
    } else {
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
      // Guard DateTime.MinValue serializado desde backend
      if (typeof value === 'string' && value.startsWith('0001-01-01')) return '';
      const date = new Date(value);
      if (isNaN(date.getTime()) || date.getFullYear() < 1900) return '';
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
    if (this.camposForm.invalid) return this.camposForm.markAllAsTouched();
    const { fechaInicio, fechaFin } = this.camposForm.value;
    this.cargando = true;

    this.reportesService.getReporteDinamicoAlertas(fechaInicio, fechaFin)
      .subscribe({
        next: (response) => {
          this.reportes = response as ReporteDinamicoAlertas[];
          this.cargando = false;
        },
        error: (err) => {
          this.cargando = false;
        }
      }); 
  }

  exportExcel() {
    this.excelExportService.exportToExcel<ReporteDinamicoAlertas>(
      { rows: this.reportes, columns: this.columnasParaMostrar, sheetName: `Reporte Dinamico Alertas` }, 
      'Reporte Dinamico Alertas',
    );
  }
}
