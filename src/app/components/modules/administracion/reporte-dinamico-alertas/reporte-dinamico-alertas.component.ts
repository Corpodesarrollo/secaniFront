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
  selector: 'app-reporte-dinamico-alertas',
  standalone: true,
  imports: [ButtonModule, CalendarModule, CheckboxModule, CommonModule, ReactiveFormsModule, InputGroupAddonModule, InputGroupModule, InputTextModule, TableModule],
  templateUrl: './reporte-dinamico-alertas.component.html',
  styleUrl: './reporte-dinamico-alertas.component.css'
})
export class ReporteDinamicoAlertasComponent implements OnInit {
  public reportes: any[] = [];
  public columnas!: any[];

  public camposForm!: FormGroup;
  public campos: { header: string, field: string }[] = [
    { header: 'Nombre NNA', field: 'nombreNNA' },
    { header: 'EAPB', field: 'eapb' },
    { header: 'Categoría alerta', field: 'categoriaAlerta' },
    { header: 'Procesos con dificultad', field: 'procesosConDificultad' },
    { header: 'Edad NNA', field: 'edadNNA' },
    { header: 'Correo electrónico', field: 'correoElectronico' },
    { header: 'Subcategoria alerta', field: 'subcategoriaAlerta' },
    { header: 'Respuesta entidad', field: 'respuestaEntidad' },
    { header: 'Diagnóstico', field: 'diagnostico' },
    { header: 'Agente de seguimiento', field: 'agenteDeSeguimiento' },
    { header: 'Estado', field: 'estado' },
    { header: 'Fecha de respuesta entidad', field: 'fechaRespuestaEntidad' },
    { header: 'Sitio de residencia actual', field: 'sitioResidenciaActual' },
    { header: 'Por cuanto tiempo dejó de asistir', field: 'tiempoDejoAsistir' },
    { header: 'Estudia actualmente', field: 'estudiaActualmente' },
    { header: 'Claridad de IPS y médicos del diagnóstico y tratamiento', field: 'claridadIpsMedicos' },
    { header: 'Quién asumió los costos de traslado', field: 'costosTraslado' },
    { header: 'Unidad de medida de tiempo', field: 'unidadMedidaTiempo' },
    { header: 'Ha dejado de asistir al colegio', field: 'dejoAsistirColegio' },
    { header: 'Viáticos dan cobertura al traslado', field: 'viaticosCoberturaTraslado' },
    { header: 'Quién asumió los costos de la vivienda', field: 'costosVivienda' },
    { header: 'Causas de inasistencias', field: 'causasInasistencias' },
    { header: 'Tiempo de inasistencia al colegio', field: 'tiempoInasistenciaColegio' },
    { header: 'Apoyo de fundaciones', field: 'apoyoFundaciones' },
    { header: 'Ha dejado de asistir al tratamiento', field: 'dejoAsistirTratamiento' },
    { header: 'Otra', field: 'otra' },
    { header: 'Unidad de medida tiempo', field: 'unidadMedidaTiempoOtra' }, // Asumí que esta es diferente de la anterior
    { header: 'Nombre de la fundación', field: 'nombreFundacion' },
    { header: 'Tipo de seguimiento', field: 'tipoSeguimiento' },
    { header: 'Apoyo recibido por fundación', field: 'apoyoRecibidoFundacion' }
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
      { field: 'fechaResolucion', header: 'Fecha de resolución' },
      { field: 'gestionConrreos', header: 'Gestión de correos' },
      { field: 'nombresApellidos', header: 'Nombres y apellidos NNA' },
      { field: 'observacion', header: 'Observación' }
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
