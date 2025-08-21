import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { Parametricas } from '../../../models/parametricas.model';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SeguimientoStepsComponent } from '../gestion/seguimientos/seguimiento-steps/seguimiento-steps.component';
import { TpParametros } from '../../../core/services/tpParametros';
import { GenericService } from '../../../services/generic.services';
import { apis } from '../../../models/apis.model';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-notificacion-respuesta2',
  standalone: true,
  imports: [CommonModule, CardModule, SeguimientoStepsComponent, ReactiveFormsModule, ProgressSpinnerModule,
  DropdownModule, CalendarModule, FormsModule, InputTextModule],
  templateUrl: './notificacion-respuesta.component.html',
  styleUrl: './notificacion-respuesta.component.css'
})
export class NotificacionRespuestaComponent {
  entidades: Parametricas[] = [];
  contactForm: FormGroup;
  selectedFile: File | null = null;
  isLoadingEntidades: boolean = false;
  selectedEntidad: Parametricas | undefined;
  submitted: boolean = false;
  isValid: boolean | null = null;
  fileError: string | null = null;
  fileName: string | null = null;
  nombreFuncionario: string = '';
  cargo: string = '';
  correo: string = '';
  telefono: string = '';
  respuesta: string = '';
  archivo: any;
  idNotificacion: string = '';
  isLoading: boolean = false;
  isOK: boolean = false;
  saving: boolean = false;

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  constructor(private fb: FormBuilder, private tp: TpParametros, private gs: GenericService) {
    this.contactForm = this.fb.group({
      entidad: [null, Validators.required],
      nombreFuncionario: ['', Validators.required],
      cargo: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: [''],
      respuesta: ['', Validators.required],
      archivo: [null] // Remover Validators.required si el archivo no es obligatorio
    });
  }

  async ngOnInit(): Promise<void> {
    const url = window.location.href;
    const id = url.split('/').pop();
    const decodedId = decodeURIComponent(id || '');
    this.idNotificacion = atob(decodedId);
    this.isLoading = true;
    this.validarRespuesta(this.idNotificacion);

    this.isLoadingEntidades = true;
    this.entidades = await this.tp.getEntidades();
    this.isLoadingEntidades = false;
    this.isLoading = false;
  }

  // Manejar cambio de entidad en el dropdown
  onEntidadChange(event: any): void {
    this.selectedEntidad = event.value;
    this.contactForm.get('entidad')?.setValue(event.value?.codigo || null);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.fileError = null;
    this.fileName = null;

    if (file) {
      const fileType = file.type;
      const fileSize = file.size;

      // Validar tipos permitidos
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/jpeg'];

      if (!allowedTypes.includes(fileType)) {
        this.fileError = 'Tipo de archivo no permitido. Solo PDF, Word, Excel y JPG están permitidos.';
        return;
      }

      // Validar tamaño máximo de archivo (5MB)
      const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
      if (fileSize > maxSizeInBytes) {
        this.fileError = 'El archivo excede el tamaño máximo permitido de 5MB.';
        return;
      }

      // Si todo es válido, guardar el archivo seleccionado
      this.selectedFile = file;
      this.fileName = file.name;
      this.contactForm.patchValue({
        archivo: file
      });
    }
  }

  openFileDialog(event: Event) {
    this.fileInput.nativeElement.click();
    event.stopPropagation();  // Evita que el evento se propague dos veces
  }

  onSubmit() {    
    if (this.saving) {
      return;
    }

    this.saving = true;
    this.submitted = true;
    
    // Debug: verificar estado del formulario
    console.log('Formulario válido:', this.contactForm.valid);
    console.log('Valores del formulario:', this.contactForm.value);
    
    if (this.contactForm.valid) {
      try {
        const formData = new FormData();
        
        // 1. Archivo
        const archivoValue = this.contactForm.get('archivo')?.value;
        if (archivoValue instanceof File) {
          formData.append('archivo', archivoValue, archivoValue.name);
          console.log('Archivo agregado:', archivoValue.name);
        }

        // 2. Entidad - CORREGIDO: usar el valor del formulario, no la variable selectedEntidad
        const entidadValue = this.contactForm.get('entidad')?.value;
        if (entidadValue) {
          // Si es objeto, tomar el código; si es string, usarlo directamente
          const entidadCodigo = typeof entidadValue === 'object' ? entidadValue.codigo : entidadValue;
          if (entidadCodigo) {
            formData.append('entidad', entidadCodigo.toString());
            console.log('Entidad agregada:', entidadCodigo);
          }
        }

        // 3. ID Notificación - VERIFICAR que this.idNotificacion tenga valor
        if (this.idNotificacion) {
          formData.append('idNotificacion', this.idNotificacion.toString());
          console.log('ID Notificación agregado:', this.idNotificacion);
        } else {
          console.error('idNotificacion está vacío o undefined');
        }

        // 4. Campos del formulario - FUNCIÓN MEJORADA
        const appendFormField = (fieldName: string, formControlName: string) => {
          const control = this.contactForm.get(formControlName);
          if (control && control.value !== null && control.value !== undefined && control.value !== '') {
            formData.append(fieldName, control.value.toString());
            console.log(`${fieldName} agregado:`, control.value);
          }
        };

        appendFormField('nombreFuncionario', 'nombreFuncionario');
        appendFormField('cargo', 'cargo');
        appendFormField('correo', 'correo');
        appendFormField('telefono', 'telefono');
        appendFormField('respuesta', 'respuesta');

        // Debug: ver contenido del FormData
        this.logFormDataContents(formData);

        // 5. Llamada al API
        this.gs.post('Notificacion/NotificacionRespuesta', formData, "Seguimiento").subscribe(
          response => {
            try {
              let result = response as {estado: boolean, descripcion: string};
              if (result.estado) {
                this.resetForm();
                this.isOK = true;
                console.log('✅ Success:', result.descripcion);
              } else {
                this.isOK = false;
                console.error('❌ Server error:', result.descripcion);
                this.showErrorMessage(result.descripcion || 'Error del servidor');
              }
            } catch (parseError) {
              console.error('❌ Error parsing response:', parseError);
              this.showErrorMessage('Error procesando la respuesta del servidor');
            }
            this.saving = false;
          },
          error => {
            console.error('❌ HTTP error:', error);
            console.error('❌ Error status:', error?.status);
            console.error('❌ Error message:', error?.message);
            
            let errorMsg = 'Error de conexión';
            if (error?.status === 404) {
              errorMsg = 'Endpoint no encontrado';
            } else if (error?.status === 500) {
              errorMsg = 'Error interno del servidor';
            } else if (error?.error?.descripcion) {
              errorMsg = error.error.descripcion;
            }
            
            this.showErrorMessage(errorMsg);
            this.saving = false;
          }
        );

      } catch (formDataError) {
        console.error('❌ Error creating FormData:', formDataError);
        this.showErrorMessage('Error preparando los datos para enviar');
        this.saving = false;
      }
    } else {
      // Mostrar errores de validación
      this.markFormGroupTouched(this.contactForm);
      console.log('❌ Form invalid. Errors:');
      Object.keys(this.contactForm.controls).forEach(key => {
        const control = this.contactForm.get(key);
        if (control?.invalid) {
          console.log(`- ${key}:`, control.errors);
        }
      });
      this.saving = false;
    }
  }

  // Métodos auxiliares
  private logFormDataContents(formData: FormData): void {
    console.log('=== FORMDATA CONTENTS ===');
    for (let pair of (formData as any).entries()) {
      if (pair[1] instanceof File) {
        console.log(`${pair[0]}: File - ${pair[1].name} (${pair[1].size} bytes)`);
      } else {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
    }
  }

  private resetForm(): void {
    this.contactForm.reset();
    this.submitted = false;
    this.fileName = null;
    this.selectedFile = null;
    
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  private showErrorMessage(message: string): void {
    // Usar tu servicio de mensajes o console.error
    console.error('Error:', message);
    // this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormControl) {
        control.markAsTouched();
      } else if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  validarRespuesta(decodedId: string) {
    this.gs.get('Notificacion/ValidarNotificacion/', `${decodedId}`, apis.seguimiento).subscribe(
        response => {
          let result = response as {estado: boolean, descripcion: string};
          this.isValid = result.estado;
        },
        error => {
          console.error('Error al subir el archivo', error);
        }
      );
  }
}


