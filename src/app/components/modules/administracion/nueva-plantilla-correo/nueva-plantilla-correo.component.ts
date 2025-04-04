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

@Component({
  selector: 'app-nueva-plantilla-correo',
  standalone: true,
  imports: [CommonModule, ButtonModule, DropdownModule, EditorModule, InputTextModule, InputTextareaModule, ReactiveFormsModule, RouterModule, ToastModule],
  templateUrl: './nueva-plantilla-correo.component.html',
  styleUrl: './nueva-plantilla-correo.component.css',
  providers: [MessageService],
})
export class NuevaPlantillaCorreoComponent {

  public tiposPlantillas: any[] = [];
  public firmantes: any[] = [];
  public estados: any[] = [];

  public plantillaId: string | null = null;
  public plantillaCorreoForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private plantillasCorreoService: PlantillasCorreoService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.plantillaCorreoForm = this.formBuilder.group({
      id: [''],
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
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.plantillaId = id; // Guarda el id
        this.obtenerPlantillaPorId(id); // Carga los datos de la plantilla si estamos editando
      }
    });
  }

  async obtenerPlantillaPorId(id: string) {
    const datos = await this.plantillasCorreoService.obtnenerPlantillaCorreoPorId(id);
    if (datos) this.plantillaCorreoForm.patchValue(datos);
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

    const data = this.plantillaCorreoForm.value;
    await this.plantillasCorreoService.crearEditarPlantillaCorreo(data);

    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Plantilla de correo creada o actualizada correctamente' });
    this.plantillaCorreoForm.reset();
  }
}
