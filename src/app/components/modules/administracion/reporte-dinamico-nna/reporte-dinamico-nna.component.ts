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

@Component({
  selector: 'app-reporte-dinamico-nna',
  standalone: true,
  imports: [ButtonModule, CalendarModule, CheckboxModule, CommonModule, ReactiveFormsModule, InputGroupAddonModule, InputGroupModule, InputTextModule, TableModule],
  templateUrl: './reporte-dinamico-nna.component.html',
  styleUrl: './reporte-dinamico-nna.component.css'
})
export class ReporteDinamicoNnaComponent {
  public reportes: any[] = [];
  public columnas!: any[];

  public camposForm!: FormGroup;
  public campos: { header: string, field: string }[] = [
    { header: 'Fecha notificación', field: 'fechaNotificacion' },
    { header: 'Origen del reporte', field: 'origenReporte' },
    { header: 'Fecha de nacimiento', field: 'fechaNacimiento' },
    { header: 'País de nacimiento', field: 'paisNacimiento' },
    { header: 'Tipo de seguimiento', field: 'tipoSeguimiento' },
    { header: 'Etnia', field: 'etnia' },
    { header: 'Departamento de nacimiento', field: 'departamentoNacimiento' },
    { header: 'Ciudad de nacimiento', field: 'ciudadNacimiento' },
    { header: 'Grupo poblacional', field: 'grupoPoblacional' },
    { header: 'Departamento procedencia', field: 'departamentoProcedencia' },
    { header: 'Municipio procedencia', field: 'municipioProcedencia' },
    { header: 'Barrio procedencia', field: 'barrioProcedencia' },
    { header: 'Área procedencia', field: 'areaProcedencia' },
    { header: 'Dirección procedencia', field: 'direccionProcedencia' },
    { header: 'Estrato', field: 'estrato' },
    { header: 'Teléfono', field: 'telefono' },
    { header: 'Departamento donde actualmente recibe el tratamiento', field: 'departamentoTratamiento' },
    { header: 'Estado de ingreso a la estrategia', field: 'estadoIngresoEstrategia' },
    { header: 'Fecha de ingreso a la estrategia', field: 'fechaIngresoEstrategia' },
    { header: 'Régimen de afiliación', field: 'regimenAfiliacion' },
    { header: 'Asegurador', field: 'asegurador' },
    { header: 'IPS / UPGD', field: 'ipsUpgd' },
    { header: 'Teléfono de contacto', field: 'telefonoContacto' },
    { header: 'Contacto', field: 'contacto' },
    { header: 'Parentesco', field: 'parentesco' },
    { header: 'Correo electrónico', field: 'correoElectronico' }
  ];


  constructor(private formBuilder: FormBuilder) {
    this.camposForm = this.formBuilder.group({
      buscador: [''], // Campo de búsqueda
      fechaInicio: ['', Validators.required], // Campo de fecha de inicio con validación requerida
      fechaFin: ['', Validators.required], // Campo de fecha de fin con validación requerida
      camposSeleccionados: this.formBuilder.array([])
    });
  }

  ngOnInit(): void {
    this.columnas = [
      { field: 'primerNombre', header: 'Primer nombre' },
      { field: 'segundoNombre', header: 'Segundo nombre' },
      { field: 'primerApellido', header: 'Primer apellido' },
      { field: 'segundoApellido', header: 'Segundo apellido' },
      { field: 'diagnostico', header: 'Diagnóstico' },
      { field: 'edad', header: 'Edad' },
      { field: 'sexo', header: 'Sexo' },
      { field: 'tipoIdentificacion', header: 'Tipo de identificación' },
      { field: 'numeroIdentificacion', header: 'Número de identificación' },
    ];
  }

  get camposSeleccionados() {
    return this.camposForm.get('camposSeleccionados') as FormArray;
  }

  onSubmit(): void {
    if ( this.camposForm.invalid ) return;
    console.log(this.camposForm.value);
  }
}
