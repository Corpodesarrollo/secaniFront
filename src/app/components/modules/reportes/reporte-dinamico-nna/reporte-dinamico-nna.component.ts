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
import { ReporteDinamicoNNA } from '../../../../models/reporteDinamicoNNA.model';
import { ExcelExportService } from '../../../../services/excel-export.service';
import { FormUtils } from '../../../../utils/form-utils';
import { Columna } from '../../../../models/columna';
import { PermisoDirective } from '../../../../directives/permiso.directive';

@Component({
  selector: 'app-reporte-dinamico-nna',
  standalone: true,
  imports: [ButtonModule, CalendarModule, CheckboxModule, CommonModule, ReactiveFormsModule, InputGroupAddonModule, InputGroupModule, InputTextModule, TableModule, PermisoDirective],
  templateUrl: './reporte-dinamico-nna.component.html',
  styleUrl: './reporte-dinamico-nna.component.css'
})
export class ReporteDinamicoNnaComponent {
  public reportes: ReporteDinamicoNNA[] = [];
  public camposForm!: FormGroup;
  public cargando: boolean = false;

  public columnasObligatorias: Columna<ReporteDinamicoNNA>[] = [
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

  public columnasOpcionales: Columna<ReporteDinamicoNNA>[] = [
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
    { header: 'Barrio procedencia', field: 'residenciaOrigenBarrio' },
    { header: 'Área procedencia', field: 'areaProcedencia' },
    { header: 'Dirección procedencia', field: 'residenciaOrigenDireccion' },
    { header: 'Estrato', field: 'residenciaOrigenEstratoId' },
    { header: 'Teléfono', field: 'residenciaActualTelefono' },
    { header: 'Departamento donde actualmente recibe el tratamiento', field: 'departamentoResidenciaActual' },
    { header: 'Estado de ingreso a la estrategia', field: 'estadoIngresoEstrategia' },
    { header: 'Fecha de ingreso a la estrategia', field: 'fechaIngresoEstrategia' },
    { header: 'Régimen de afiliación', field: 'tipoRegimenSS' },
    { header: 'Asegurador', field: 'eps' },
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

  onCheckboxChange(event: any, columna: Columna<ReporteDinamicoNNA>): void {
    const selected = this.camposSeleccionados;
    const index = selected.controls.findIndex(ctrl => ctrl.value.field === columna.field);

    // p-checkbox PrimeNG con [value] sin ngModel emite event.checked como array.
    // Toggle por presencia en lista (ignorar event.checked).
    if (index === -1) {
      selected.push(new FormControl(columna));
    } else {
      selected.removeAt(index);
    }
  }

  isDateField(field: string): boolean {
    return ['fechaNacimiento', 'fechaNotificacionSIVIGILA', 'fechaIngresoEstrategia'].includes(field);
  }

  formatCell(value: any, field: string): string {
    if (this.isDateField(field) && value) {
      if (typeof value === 'string' && value.startsWith('0001-01-01')) return '';
      const date = new Date(value);
      if (isNaN(date.getTime()) || date.getFullYear() < 1900) return '';
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yyyy = date.getFullYear();
      const hh = String(date.getHours()).padStart(2, '0');
      const mi = String(date.getMinutes()).padStart(2, '0');
      return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
    }
    if (typeof value === 'boolean') return value ? 'Sí' : 'No';
    return value ?? '';
  }

  get columnasParaMostrar(): Columna<ReporteDinamicoNNA>[] {
    return [...this.columnasObligatorias, ...this.camposSeleccionados.value];
  }

  get columnasFiltroGlobal(): string[] {
    return this.columnasParaMostrar.map(col => col.field);
  }

  onSubmit() {
    if (this.camposForm.invalid) return;
    const { fechaInicio, fechaFin } = this.camposForm.value;
    this.cargando = true;

    this.reportesService.getReporteDinamicoNNA(fechaInicio, fechaFin)
      .subscribe({
        next: (response: any) => {
          this.reportes = response;
          this.cargando = false;
        },
        error: (err) => {
          this.cargando = false;
        }
      });
  }

  exportExcel() {
    this.excelExportService.exportToExcel<ReporteDinamicoNNA>(
      { rows: this.reportes, columns: this.columnasParaMostrar, sheetName: `Reporte Dinamico NNA` }, 
      'Reporte Dinamico NNA',
    );
  }
}
