import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-nueva-plantilla-correo',
  standalone: true,
  imports: [CommonModule, ButtonModule, DropdownModule, EditorModule, InputTextModule, InputTextareaModule, ReactiveFormsModule, RouterModule],
  templateUrl: './nueva-plantilla-correo.component.html',
  styleUrl: './nueva-plantilla-correo.component.css'
})
export class NuevaPlantillaCorreoComponent {
  public tiposPlantillas: any[] = [];
  public firmantes: any[] = [];
  public estados: any[] = [];

  public plantillaCorreoForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.plantillaCorreoForm = this.formBuilder.group({
      nombre: ['', [Validators.required,  Validators.maxLength(100)]],
      tipoPlantilla: ['', Validators.required],
      firmante: ['', Validators.required],
      estado: ['', Validators.required],
      asunto: ['', [Validators.required, Validators.maxLength(50)]],
      mensaje: ['', [Validators.required, Validators.maxLength(10000)]],
      cierre: ['', [Validators.required, Validators.maxLength(1000)]]
    });
  }

  isValidField( field: string ): boolean | null {
    return this.plantillaCorreoForm.controls[field].errors
      && this.plantillaCorreoForm.controls[field].touched;
  }

  getFieldError( field: string ): string | null {
    if ( !this.plantillaCorreoForm.controls[field] ) return null;

    const errors = this.plantillaCorreoForm.controls[field].errors || {};
    for (const key of Object.keys(errors) ) {
      console.log(key);
      switch( key ) {
        case 'required':
          return 'Este campo es requerido';
        case 'maxlength':
          return `Maximo ${ errors['maxlength'].requiredLength } carácteres.`;
      }
    }
    return null;
  }

  onSubmit(): void {
    if(this.plantillaCorreoForm.invalid)
      return this.plantillaCorreoForm.markAllAsTouched();;
    console.log(this.plantillaCorreoForm.value);
    this.plantillaCorreoForm.reset();
  }
}
