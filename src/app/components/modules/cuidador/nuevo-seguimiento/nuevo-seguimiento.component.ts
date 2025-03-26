import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-nuevo-seguimiento',
  standalone: true,
  imports: [ ButtonModule, CalendarModule, DropdownModule, FileUploadModule, InputTextModule, ReactiveFormsModule ],
  templateUrl: './nuevo-seguimiento.component.html',
  styleUrl: './nuevo-seguimiento.component.css'
})
export class NuevoSeguimientoComponent {

  reporteForm: FormGroup;
  sexoOptions = [{ label: 'Masculino', value: 'H' }, { label: 'Femenino', value: 'M' }];
  diagnosticoOptions = [{ label: 'Sí', value: true }, { label: 'No', value: false }];
  aseguradoraOptions = [{ label: 'EPS1', value: 'EPS1' }, { label: 'EPS2', value: 'EPS2' }];
  departamentoOptions = [{ label: 'Departamento1', value: 'Dep1' }, { label: 'Departamento2', value: 'Dep2' }];
  municipioOptions = [{ label: 'Municipio1', value: 'Mun1' }, { label: 'Municipio2', value: 'Mun2' }];

  constructor(private formbuilder: FormBuilder) {
    this.reporteForm = this.formbuilder.group({
      primerNombre: [''],
      segundoNombre: [''],
      primerApellido: [''],
      segundoApellido: [''],
      fechaNacimiento: [''],
      sexoAsignado: [''],
      tieneDiagnostico: [''],
      aseguradora: [''],
      departamento: [''],
      municipio: [''],
      evidenciaDiagnostico: [''],
      evidenciaParentesco: ['']
    });
  }

  onSubmit() {
    if (!this.reporteForm.valid) return;
  }

  onUpload(event: any) {
    console.log("Archivo subido:", event);
  }
}
