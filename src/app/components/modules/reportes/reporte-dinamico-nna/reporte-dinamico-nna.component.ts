import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControlOptions, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

import { ReportesService } from '../../../../services/reportes.service';
import { Reporte } from '../../../../models/reporte.model';
import { ExcelExportService } from '../../../../services/excel-export.service';
import { FormUtils } from '../../../../utils/form-utils';
import { Columna } from '../../../../models/columna';

@Component({
  selector: 'app-reporte-dinamico-nna',
  standalone: true,
  imports: [ButtonModule, CalendarModule, CheckboxModule, CommonModule, ReactiveFormsModule, InputGroupAddonModule, InputGroupModule, InputTextModule, TableModule],
  templateUrl: './reporte-dinamico-nna.component.html',
  styleUrl: './reporte-dinamico-nna.component.css'
})
export class ReporteDinamicoNnaComponent {
  public reportes: Reporte[] = [];
  public camposForm!: FormGroup;

  public columnasObligatorias: Columna[] = [
    { header: 'Primer nombre', field: 'primerNombre' },
    { header: 'Segundo nombre', field: 'segundoNombre' },
    { header: 'Primer apellido', field: 'primerApellido' },
    { header: 'Segundo apellido', field: 'segundoApellido' },
    { header: 'Diagnóstico ', field: 'diagnostico' },
    { header: 'Edad ', field: 'edad' },
    { header: 'Sexo ', field: 'sexo' },
    { header: 'Tipo de identificación', field: 'tipoIdentificacion' },
    { header: 'Número de identificación', field: 'numeroIdentificacion' },
  ];

  public columnasOpcionales: Columna[] = [
    { header: 'Fecha notificación', field: 'fechaNotificacionSIVIGILA' },
    { header: 'Origen del reporte', field: 'origenReporte' },
    { header: 'Fecha de nacimiento', field: 'fechaNacimiento' },
    { header: 'País de nacimiento', field: 'pais' },
    { header: 'Tipo de seguimiento', field: 'tipoSeguimiento' },
    { header: 'Etnia', field: 'etnia' },
    { header: 'Departamento de nacimiento', field: 'departamentoNacimiento' },
    { header: 'Ciudad de nacimiento', field: 'municipioNacimiento' },
    { header: 'Grupo poblacional', field: 'grupoPoblacion' },
    { header: 'Departamento procedencia', field: 'residenciaOrigenDepartamento' },
    { header: 'Municipio procedencia', field: 'residenciaOrigenMunicipio' },
    { header: 'Barrio procedencia', field: 'barrioProcedencia' },
    { header: 'Área procedencia', field: 'residenciaOrigenBarrio' },
    { header: 'Dirección procedencia', field: 'residenciaOrigenDireccion' },
    { header: 'Estrato', field: 'residenciaOrigenEstratoId' },
    { header: 'Teléfono', field: 'residenciaActualTelefono' },
    { header: 'Departamento donde actualmente recibe el tratamiento', field: 'departamentoTratamiento' },
    { header: 'Estado de ingreso a la estrategia', field: 'estadoIngresoEstrategia' },
    { header: 'Fecha de ingreso a la estrategia', field: 'fechaIngresoEstrategia' },
    { header: 'Régimen de afiliación', field: 'tipoRegimenSS' },
    { header: 'Asegurador', field: 'asegurador' },
    { header: 'IPS / UPGD', field: 'ips' },
    { header: 'Teléfono de contacto', field: 'cuidadorTelefono' },
    { header: 'Contacto', field: 'cuidadorNombres' },
    { header: 'Parentesco', field: 'cuidadorParentesco' },
    { header: 'Correo electrónico', field: 'cuidadorEmail' }
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
      } as AbstractControlOptions);
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

  onSubmit() {
    if (this.camposForm.invalid) return;
    const { fechaInicio, fechaFin } = this.camposForm.value;

    const fechaInicialString = fechaInicio.toISOString().split('T')[0];
    const fechaFinalString = fechaFin.toISOString().split('T')[0];

    this.reportesService.getReporteDinamicoNNA(fechaInicialString, fechaFinalString)
      .subscribe((reportes: any) => this.reportes = reportes);
  }

  exportExcel() {
    this.excelExportService.exportToExcel<any>(
      { rows: this.reportes, columns: this.columnasParaMostrar, sheetName: `Reporte Dinamico NNA` }, 
      'Reporte Dinamico NNA',
    );
  }
}
