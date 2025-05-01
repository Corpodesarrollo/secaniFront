import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { FormUtils } from '../../../../utils/form-utils';

@Component({
  selector: 'app-reporte-dinamico-eapb',
  standalone: true,
  imports: [ButtonModule, CalendarModule, CheckboxModule, CommonModule, DropdownModule, ReactiveFormsModule, InputGroupAddonModule, InputGroupModule, InputTextModule, TableModule],
  templateUrl: './reporte-dinamico-eapb.component.html',
  styleUrl: './reporte-dinamico-eapb.component.css'
})
export class ReporteDinamicoEapbComponent implements OnInit {
  public reportes: any[] = [];
  public columnas!: any[];

  public camposForm!: FormGroup;
  public campos: { header: string, field: string }[] = [
    { header: 'Promedio de tiempo de respuesta a alertas', field: 'promedioTiempoRespuestaAlertas' },
    { header: 'Casos por Régimen de afiliación Contributivo', field: 'casosRegimenAfiliacionContributivo' },
    { header: 'Casos por Régimen de afiliación Subsidiado', field: 'casosRegimenAfiliacionSubsidiado' },
    { header: 'Casos por Régimen de afiliación Especial/Excepción', field: 'casosRegimenAfiliacionEspecial' },
    { header: 'Casos por Régimen de afiliación No asegurados', field: 'casosRegimenAfiliacionNoAsegurados' },
    { header: 'Total alertas resueltas', field: 'totalAlertasResueltas' },
    { header: 'Casos con seguimiento por iniciar', field: 'casosSeguimientoPorIniciar' },
    { header: 'Casos con seguimiento en proceso', field: 'casosSeguimientoEnProceso' },
    { header: 'Casos con seguimiento culminado', field: 'casosSeguimientoCulminado' }
  ];

  constructor(private formBuilder: FormBuilder) {
    this.camposForm = this.formBuilder.group({
      buscador: [''], // Campo de búsqueda
      fechaInicio: ['', Validators.required], // Campo de fecha de inicio con validación requerida
      fechaFin: ['', Validators.required], // Campo de fecha de fin con validación requerida
      camposSeleccionados: this.formBuilder.array([])
    }, { 
      validators: [FormUtils.validarFechas('fechaInicio', 'fechaFin')],
    });
  }

  ngOnInit(): void {
    this.columnas = [
      { header: 'EAPB', field: 'eapb' },
      { header: 'Casos asociados', field: 'casosAsociados' },
      { header: 'Casos con alertas sin resolver', field: 'casosAlertasSinResolver' },
      { header: 'Total de alertas sin resolver', field: 'totalAlertasSinResolver' }
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
