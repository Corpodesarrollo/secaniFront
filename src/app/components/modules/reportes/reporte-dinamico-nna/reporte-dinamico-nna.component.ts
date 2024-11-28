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

@Component({
  selector: 'app-reporte-dinamico-nna',
  standalone: true,
  imports: [ButtonModule, CalendarModule, CheckboxModule, CommonModule, ReactiveFormsModule, InputGroupAddonModule, InputGroupModule, InputTextModule, TableModule],
  templateUrl: './reporte-dinamico-nna.component.html',
  styleUrl: './reporte-dinamico-nna.component.css'
})
export class ReporteDinamicoNnaComponent {
  public reportes: Reporte[] = [];
  public columnas!: string[];

  public camposForm!: FormGroup;

  public campos: { header: string, field: string }[] = [
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

  constructor(private formBuilder: FormBuilder, private reportesService: ReportesService) {
    this.camposForm = this.formBuilder.group({
      fechaInicio: ['', Validators.required], // Campo de fecha de inicio con validación requerida
      fechaFin: ['', Validators.required], // Campo de fecha de fin con validación requerida
      camposSeleccionados: this.formBuilder.array([])
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

  get camposSeleccionados() {
    return this.camposForm.value.camposSeleccionados;
  }

  async onSubmit() {
    if (this.camposForm.invalid) return;
    const { fechaInicio, fechaFin } = this.camposForm.value;

    this.reportes = await this.reportesService
      .getReporteDinamicoNNA(fechaInicio.toISOString(), fechaFin.toISOString());
  }
}
