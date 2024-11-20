import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-reporte-dinamico-seguimiento',
  standalone: true,
  imports: [ButtonModule, CalendarModule, CheckboxModule, CommonModule, ReactiveFormsModule, InputGroupAddonModule, InputGroupModule, InputTextModule, TableModule],
  templateUrl: './reporte-dinamico-seguimiento.component.html',
  styleUrl: './reporte-dinamico-seguimiento.component.css'
})
export class ReporteDinamicoSeguimientoComponent implements OnInit {
  public reportes: any[] = [];
  public columnas!: any[];

  public camposForm!: FormGroup;
  public campos: { header: string, field: string }[] = [
    { field: 'fechaConsulta', header: 'Fecha de consulta' },
    { field: 'fechaDiagnostico', header: 'Fecha de diagnóstico' },
    { field: 'razonesNoDiagnosticado', header: 'Razones de No diagnosticado' },
    { field: 'razonesNoInicioTratamiento', header: 'Razones No inicio tratamiento' },
    { field: 'fechaInicioTratamiento', header: 'Fecha inicio tratamiento' },
    { field: 'institucionTratamiento', header: 'Nombre institución en la que recibe el tratamiento' },
    { field: 'fechaUltimaRecaida', header: 'Fecha de última recaída' },
    { field: 'trasladoParaTratamiento', header: 'Se trasladó para recibir tratamiento' },
    { field: 'recurrencias', header: 'Recaídas' },
    { field: 'cantidadRecaidas', header: 'Cantidad de recaídas' },
    { field: 'residenciaActualDepartamento', header: 'Departamento residencia actual' },
    { field: 'residenciaActualMunicipio', header: 'Municipio residencia actual' },
    { field: 'residenciaActualBarrio', header: 'Barrio actual' },
    { field: 'residenciaActualArea', header: 'Área actual' },
    { field: 'residenciaActualDireccion', header: 'Dirección actual' },
    { field: 'residenciaActualEstrato', header: 'Estrato actual' },
    { field: 'capacidadEconomicaTraslado', header: 'Capacidad económica para traslado' },
    { field: 'serviciosSocialesEAPB', header: 'La EAPB suministró servicios sociales de apoyo' },
    { field: 'serviciosSocialesOportunos', header: 'Los servicios sociales de apoyo los entregaron oportunamente' },
    { field: 'observacion', header: 'Observación' },
    { field: 'parentescoContacto', header: 'Parentesco contacto' },
    { field: 'telefonoContacto', header: 'Teléfono contacto' },
    { field: 'nombreContacto', header: 'Nombre contacto' },
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
      { field: 'tipoSeguimiento', header: 'Tipo de seguimiento' },
      { field: 'asunto', header: 'Asunto' },
      { field: 'primerNombre', header: 'Primer nombre' },
      { field: 'segundoNombre', header: 'Segundo nombre' },
      { field: 'primerApellido', header: 'Primer apellido' },
      { field: 'segundoApellido', header: 'Segundo apellido' },
      { field: 'diagnostico', header: 'Diagnóstico' },
      { field: 'tipoIdentificacion', header: 'Tipo de identificación' },
      { field: 'numeroIdentificacion', header: 'Número de identificación' },
      { field: 'regimenAfiliacion', header: 'Régimen de afiliación' },
      { field: 'eapb', header: 'EAPB' },
      { field: 'estado', header: 'Estado' },
      { field: 'fechaSeguimiento', header: 'Fecha del seguimiento' },
      { field: 'observacion', header: 'Observación' },
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
