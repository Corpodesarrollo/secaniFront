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

@Component({
  selector: 'app-reporte-dinamico-seguimiento',
  standalone: true,
  imports: [ButtonModule, CalendarModule, CheckboxModule, CommonModule, ReactiveFormsModule, InputGroupAddonModule, InputGroupModule, InputTextModule, TableModule],
  templateUrl: './reporte-dinamico-seguimiento.component.html',
  styleUrl: './reporte-dinamico-seguimiento.component.css'
})
export class ReporteDinamicoSeguimientoComponent implements OnInit {
  public reportes: any[] = [];
  public camposForm!: FormGroup;

  public columnasObligatorias: Columna[] = [
    { field: 'tipoSeguimiento', header: 'Tipo de seguimiento' },
    { field: 'asunto', header: 'Asunto' },
    { field: 'primerNombre', header: 'Primer nombre' },
    { field: 'segundoNombre', header: 'Segundo nombre' },
    { field: 'primerApellido', header: 'Primer apellido' },
    { field: 'segundoApellido', header: 'Segundo apellido' },
    { field: 'diagnostico', header: 'Diagnóstico' },
    { field: 'tipoIdentificacion', header: 'Tipo de identificación' },
    { field: 'numeroIdentificacion', header: 'Número de identificación' },
    { field: 'tipoRegimenSS', header: 'Régimen de afiliación' },
    { field: 'eapb', header: 'EAPB' },
    { field: 'estado', header: 'Estado' },
    { field: 'fechaSeguimiento', header: 'Fecha del seguimiento' },
    { field: 'observacionAgente', header: 'Observación' },
  ];

  public columnasOpcionales: Columna[] = [
    { field: 'fechaConsultaDiagnostico', header: 'Fecha de consulta' },
    { field: 'fechaDiagnostico', header: 'Fecha de diagnóstico' },
    { field: 'motivoNoDiagnostico', header: 'Razones de No diagnosticado' },
    { field: 'motivoNoDiagnosticoOtro', header: 'Razones No inicio tratamiento' },
    { field: 'fechaInicioTratamiento', header: 'Fecha inicio tratamiento' },
    { field: 'ips', header: 'Nombre institución en la que recibe el tratamiento' },
    { field: 'fechaUltimaRecaida', header: 'Fecha de última recaída' },
    { field: 'trasladosHaSidoTrasladadodeInstitucion', header: 'Se trasladó para recibir tratamiento' },
    { field: 'recaida', header: 'Recaídas' },
    { field: 'cantidadRecaidas', header: 'Cantidad de recaídas' },
    { field: 'residenciaActualDepartamento', header: 'Departamento residencia actual' },
    { field: 'residenciaActualMunicipio', header: 'Municipio residencia actual' },
    { field: 'residenciaActualBarrio', header: 'Barrio actual' },
    { field: 'residenciaActualArea', header: 'Área actual' },
    { field: 'residenciaActualDireccion', header: 'Dirección actual' },
    { field: 'residenciaActualEstratoId', header: 'Estrato actual' },
    { field: 'trasladoTieneCapacidadEconomica', header: 'Capacidad económica para traslado' },
    { field: 'eapb', header: 'La EAPB suministró servicios sociales de apoyo' },
    { field: 'trasladosServiciosdeApoyoOportunos', header: 'Los servicios sociales de apoyo los entregaron oportunamente' },
    { field: 'observacionesSolicitante', header: 'Observación' },
    { field: 'cuidadorParentesco', header: 'Parentesco contacto' },
    { field: 'cuidadorTelefono', header: 'Teléfono contacto' },
    { field: 'cuidadorNombres', header: 'Nombre contacto' },
  ];

  constructor(
    private fb: FormBuilder,
    private reportesService: ReportesService,
    private excelExportService: ExcelExportService
  ) {}

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

  get camposSeleccionados(): FormArray {
    return this.camposForm.get('camposSeleccionados') as FormArray;
  }

  onCheckboxChange(event: any, columna: Columna): void {
    const selected = this.camposSeleccionados;
    const index = selected.controls.findIndex(ctrl => ctrl.value.field === columna.field);

    if (event.checked && index === -1) {
      selected.push(new FormControl(columna));
    } else if (!event.checked && index !== -1) {
      selected.removeAt(index);
    }
  }

  get columnasParaMostrar(): Columna[] {
    return [...this.columnasObligatorias, ...this.camposSeleccionados.value];
  }

  get columnasFiltroGlobal(): string[] {
    return this.columnasParaMostrar.map(col => col.field);
  }

  async onSubmit() {
    if (this.camposForm.invalid) return;
    const { fechaInicio, fechaFin } = this.camposForm.value;

    const fechaInicialString = fechaInicio.toISOString().split('T')[0];
    const fechaFinalString = fechaFin.toISOString().split('T')[0];

    this.reportesService.getReporteSeguimientos(fechaInicialString, fechaFinalString)
      .subscribe((reportes: any) => this.reportes = reportes);
  }

  exportExcel() {
    this.excelExportService.exportToExcel<any>(
      { rows: this.reportes, columns: this.columnasParaMostrar, sheetName: `Reporte Dinamico Seguimiento` }, 
      'Reporte Dinamico Seguimiento',
    );
  }
}
