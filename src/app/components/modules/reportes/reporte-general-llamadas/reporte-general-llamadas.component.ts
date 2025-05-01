import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { FormUtils } from '../../../../utils/form-utils';

@Component({
  selector: 'app-reporte-general-llamadas',
  standalone: true,
  imports: [ButtonModule, CalendarModule, CommonModule, InputGroupAddonModule, InputGroupModule, InputTextModule, TableModule],
  templateUrl: './reporte-general-llamadas.component.html',
  styleUrl: './reporte-general-llamadas.component.css'
})
export class ReporteGeneralLlamadasComponent implements OnInit {
  public reportes: any[] = [];
  public camposForm!: FormGroup;

  constructor( private formBuilder: FormBuilder) {
    this.formBuilder.group({
      buscador: [''], // Campo de búsqueda
      fechaInicio: ['', Validators.required], // Campo de fecha de inicio con validación requerida
      fechaFin: ['', Validators.required], // Campo de fecha de fin con validación requerida
    }, { 
      validators: [FormUtils.validarFechas('fechaInicio', 'fechaFin')],
    });
  }

  ngOnInit(): void {
  }
}
