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
  selector: 'app-reporte-dinamico-entidad-territorial',
  standalone: true,
  imports: [ButtonModule, CalendarModule, CheckboxModule, CommonModule, ReactiveFormsModule, InputGroupAddonModule, InputGroupModule, InputTextModule, TableModule],
  templateUrl: './reporte-dinamico-entidad-territorial.component.html',
  styleUrl: './reporte-dinamico-entidad-territorial.component.css'
})
export class ReporteDinamicoEntidadTerritorialComponent {
  public reportes: any[] = [];
  public columnas!: any[];

  public camposForm!: FormGroup;
  public campos: { header: string, field: string }[] = [
    { header: 'Categoría alerta', field: 'categoriaAlerta' },
    { header: 'Fecha envió de respuesta', field: 'fechaEnvioRespuesta' },
    { header: 'Departamento procedencia', field: 'departamentoProcedencia' },
    { header: 'Nacionalidad', field: 'nacionalidad' },
    { header: 'Subcategoría alerta', field: 'subcategoriaAlerta' },
    { header: 'Respuesta', field: 'respuesta' },
    { header: 'Municipio procedencia', field: 'municipioProcedencia' },
    { header: 'Departamento donde actualmente recibe el tratamiento', field: 'departamentoActualmenteTratamiento' },
    { header: 'Etnia', field: 'etnia' },
    { header: 'Observaciones', field: 'observaciones' },
    { header: 'Tipo de identificación', field: 'tipoIdentificacion' },
    { header: 'Barrio procedencia', field: 'barrioProcedencia' },
    { header: 'Estado del NNA', field: 'estadoNNA' },
    { header: 'IPS primaria que reportó la alerta', field: 'ipsReportoAlerta' },
    { header: 'Número de identificación', field: 'numeroIdentificacion' },
    { header: 'Área procedencia', field: 'areaProdecencia' },
    { header: 'Régimen de afiliación', field: 'regimenAfiliacion' },
    { header: 'Diagnóstico del NNA', field: 'diagnosticoNNA' },
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
      { field: 'fechaNotificacion', header: 'Fecha notificación' },
      { field: 'nombreNNA', header: 'Nombre NNA' },
      { field: 'edad', header: 'Edad' },
      { field: 'sexo', header: 'Sexo' },
      { field: 'tiempoTranscurrido', header: 'Tiempo transcurrido en días' },
      { field: 'estado', header: 'Estado' }
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
