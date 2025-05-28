import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { MessageService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';

import { PlantillasCorreoService } from '../../../../services/plantillas-correo.service';
import { filter, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-nueva-plantilla-correo',
  standalone: true,
  imports: [CommonModule, ButtonModule, DropdownModule, EditorModule, InputTextModule, InputTextareaModule, ReactiveFormsModule, RouterModule, ToastModule],
  templateUrl: './nueva-plantilla-correo.component.html',
  styleUrl: './nueva-plantilla-correo.component.css',
  providers: [MessageService],
})
export class NuevaPlantillaCorreoComponent {

  public tiposPlantillas: string[] = [
    'Correo de notificación',
    'Oficion de notificación',
  ];

  public firmantes: any[] = ["Juan Manuel"];
  public estados: {label: string, value: string}[] = [
    { label: 'Activo', value: '1' },
    { label: 'Inactivo', value: '0' }
  ];

  public plantillaId: string | null = null;
  public plantillaCorreoForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private plantillasCorreoService: PlantillasCorreoService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.plantillaCorreoForm = this.formBuilder.group({
      id: null,
      nombre: ['', [Validators.required,  Validators.maxLength(100)]],
      tipoPlantilla: ['', Validators.required],
      firmante: ['', Validators.required],
      estado: ['', Validators.required],
      asunto: ['', [Validators.required, Validators.maxLength(50)]],
      mensaje: ['', [Validators.required, Validators.maxLength(10000)]],
      cierre: ['', [Validators.required, Validators.maxLength(1000)]]
    });
  }

  ngOnInit() {
    this.activatedRoute.paramMap
      .pipe(
        map(params => params.get('id')),
        filter((id): id is string => !!id),
        switchMap(id => this.plantillasCorreoService.getPlantillaCorreo(id)),
      )
      .subscribe({
        next: (plantillaCorreo: any) => this.plantillaCorreoForm.patchValue(plantillaCorreo),
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

  async onSubmit() {
    if(this.plantillaCorreoForm.invalid)
      return this.plantillaCorreoForm.markAllAsTouched();;

    const formData = this.plantillaCorreoForm.value;
    this.plantillasCorreoService.crearEditarPlantillaCorreo(formData)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Plantilla de correo guardada correctamente.',
            life: 3000
          });
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al guardar la plantilla de correo.',
            life: 3000
          });
        }
      });
  }
}
