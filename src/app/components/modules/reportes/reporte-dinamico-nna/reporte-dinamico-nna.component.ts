import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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

  public columnasObligatorios: { header: string, field: string }[] = [
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

  public columnasOpcionales: { header: string, field: string }[] = [
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
    private formBuilder: FormBuilder,
    private reportesService: ReportesService,
    private excelExportService: ExcelExportService
  ) {
    this.camposForm = this.formBuilder.group({
      fechaInicio: ['', Validators.required], // Campo de fecha de inicio con validación requerida
      fechaFin: ['', Validators.required], // Campo de fecha de fin con validación requerida
      camposSeleccionados: this.formBuilder.array([])
    }, { 
      validators: [FormUtils.validarFechas('fechaInicio', 'fechaFin')],
    });
  }

  ngOnInit(): void { }

  onCheckboxChange(e: any, columna: { header: string, field: string }) {
    const camposSeleccionadosArray = this.camposForm.get('camposSeleccionados') as FormArray;
    if (e.checked.length != 0) {
      camposSeleccionadosArray.push(this.formBuilder.control(columna));
    } else {
      const index = camposSeleccionadosArray.controls.findIndex(x => x.value === columna);
      if (index >= 0) camposSeleccionadosArray.removeAt(index);
    }
  }

  get columnas() {
    const columnasSeleccionadas = this.camposForm.value.camposSeleccionados;
    return [ ...this.columnasObligatorios, ...columnasSeleccionadas ];
  }

  get columnasFiltroGlobal() {
    const fieldsColumnasOpcionales = this.columnasOpcionales.map(campo => campo.field);
    const fieldsColumnasObligatorias = this.columnasObligatorios.map(campo => campo.field);
    return [ ...fieldsColumnasOpcionales, ...fieldsColumnasObligatorias ];
  }

  async onSubmit() {
    if (this.camposForm.invalid) return;
    const { fechaInicio, fechaFin } = this.camposForm.value;

    const fechaInicialString = fechaInicio.toISOString().split('T')[0];
    const fechaFinalString = fechaFin.toISOString().split('T')[0];


    this.reportes = await this.reportesService
      .getReporteDinamicoNNA(fechaInicialString, fechaFinalString);
  }

  exportExcel() {
    this.excelExportService.exportReporteToExcel(
      this.reportes, this.columnas, 'Reporte dinámico NNA'
    );
  }
}
