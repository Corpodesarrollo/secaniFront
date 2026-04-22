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
import { ReporteDinamicoSeguimiento } from '../../../../models/reporteDinamicoSeguimiento';

@Component({
  selector: 'app-reporte-dinamico-seguimiento',
  standalone: true,
  imports: [ButtonModule, CalendarModule, CheckboxModule, CommonModule, ReactiveFormsModule, InputGroupAddonModule, InputGroupModule, InputTextModule, TableModule],
  templateUrl: './reporte-dinamico-seguimiento.component.html',
  styleUrl: './reporte-dinamico-seguimiento.component.css'
})
export class ReporteDinamicoSeguimientoComponent implements OnInit {
  public reportes: ReporteDinamicoSeguimiento[] = [];
  public camposForm!: FormGroup;
  public cargando: boolean = false;

  public columnasObligatorias: Columna<ReporteDinamicoSeguimiento>[] = [
    { header: 'Tipo de seguimiento', field: 'tipoSeguimiento' },
    { header: 'Asunto', field: 'asunto' },
    { header: 'Primer nombre', field: 'primerNombre' },
    { header: 'Segundo nombre', field: 'segundoNombre' },
    { header: 'Primer apellido', field: 'primerApellido' },
    { header: 'Segundo apellido', field: 'segundoApellido' },
    { header: 'Diagnóstico', field: 'diagnostico' },
    { header: 'Tipo de identificación', field: 'tipoIdentificacion' },
    { header: 'Número de identificación', field: 'numeroIdentificacion' },
    { header: 'Régimen de afiliación', field: 'tipoRegimenSS' },
    { header: 'EAPB', field: 'eapb' },
    { header: 'Estado', field: 'estado' },
    { header: 'Fecha del seguimiento', field: 'fechaSeguimiento' },
    { header: 'Observación', field: 'observacionAgente' },
  ];

  public columnasOpcionales: Columna<ReporteDinamicoSeguimiento>[] = [
    { header: 'Fecha de consulta', field: 'fechaConsultaDiagnostico' },
    { header: 'Fecha de diagnóstico', field: 'fechaDiagnostico' },
    { header: 'Razones de No diagnosticado', field: 'motivoNoDiagnostico' },
    { header: 'Razones No inicio tratamiento', field: 'motivoNoDiagnosticoOtro' },
    { header: 'Fecha inicio tratamiento', field: 'fechaInicioTratamiento' },
    { header: 'Nombre institución en la que recibe el tratamiento', field: 'ips' },
    { header: 'Fecha de última recaída', field: 'fechaUltimaRecaida' },
    { header: 'Se trasladó para recibir tratamiento', field: 'trasladosHaSidoTrasladadodeInstitucion' },
    { header: 'Recaídas', field: 'recaida' },
    { header: 'Cantidad de recaídas', field: 'cantidadRecaidas' },
    { header: 'Departamento residencia actual', field: 'residenciaActualDepartamento' },
    { header: 'Municipio residencia actual', field: 'residenciaActualMunicipio' },
    { header: 'Barrio actual', field: 'residenciaActualBarrio' },
    { header: 'Área actual', field: 'residenciaActualArea' },
    { header: 'Dirección actual', field: 'residenciaActualDireccion' },
    { header: 'Estrato actual', field: 'residenciaActualEstratoId' },
    { header: 'Capacidad económica para traslado', field: 'trasladoTieneCapacidadEconomica' },
    { header: 'La EAPB suministró servicios sociales de apoyo', field: 'eapb' },
    { header: 'Los servicios sociales de apoyo los entregaron oportunamente', field: 'trasladosServiciosdeApoyoOportunos' },
    { header: 'Observación', field: 'observacionesSolicitante' },
    { header: 'Parentesco contacto', field: 'cuidadorParentesco' },
    { header: 'Teléfono contacto', field: 'cuidadorTelefono' },
    { header: 'Nombre contacto', field: 'cuidadorNombres' },
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

  onCheckboxChange(event: any, columna: Columna<ReporteDinamicoSeguimiento>): void {
    const selected = this.camposSeleccionados;
    const index = selected.controls.findIndex(ctrl => ctrl.value.field === columna.field);
    // PrimeNG p-checkbox sin binary emite event.checked como array de valores seleccionados
    const isChecked = Array.isArray(event.checked)
      ? event.checked.includes(columna.field)
      : !!event.checked;

    if (isChecked && index === -1) {
      selected.push(new FormControl(columna));
    } else if (!isChecked && index !== -1) {
      selected.removeAt(index);
    }
  }

  get columnasParaMostrar(): Columna<ReporteDinamicoSeguimiento>[] {
    return [...this.columnasObligatorias, ...this.camposSeleccionados.value];
  }

  get columnasFiltroGlobal(): string[] {
    return this.columnasParaMostrar.map(col => col.field);
  }

  async onSubmit() {
    if (this.camposForm.invalid) return;
    const { fechaInicio, fechaFin } = this.camposForm.value;
    this.cargando = true;

    this.reportesService.getReporteSeguimientos(fechaInicio, fechaFin)
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
    this.excelExportService.exportToExcel<ReporteDinamicoSeguimiento>(
      { rows: this.reportes, columns: this.columnasParaMostrar, sheetName: `Reporte Dinamico Seguimiento` }, 
      'Reporte Dinamico Seguimiento',
    );
  }
}
