import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
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
      entidad: ['', Validators.required],
      nombreFuncionario: ['', Validators.required],
      cargo: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      respuesta: ['', Validators.required],
      archivo: [null, Validators.required] // Inicializamos el campo como null
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
    if (this.contactForm.valid) {
      const formData = new FormData();
      formData.append('archivo', this.contactForm.get('archivo')?.value);
      if (this.selectedEntidad && this.selectedEntidad.codigo) {
        formData.append('entidad', this.selectedEntidad.codigo);
      }
      formData.append('idNotificacion', this.idNotificacion);
      formData.append('nombreFuncionario', this.contactForm.get('nombreFuncionario')?.value);
      formData.append('cargo', this.contactForm.get('cargo')?.value);
      formData.append('correo', this.contactForm.get('correo')?.value);
      formData.append('telefono', this.contactForm.get('telefono')?.value);
      formData.append('respuesta', this.contactForm.get('respuesta')?.value);

      // Llamada al método 'post'
      this.gs.post('Notificacion/NotificacionRespuesta', formData, "Seguimiento").subscribe(
        response => {
          let result = response as {estado: boolean, descripcion: string};
          if (result.estado) {
            this.contactForm.reset();
            this.fileInput.nativeElement.value = ''; // Limpiar el input de archivo
            this.fileName = null; // Limpiar el nombre del archivo
            this.selectedFile = null; // Limpiar la referencia al archivo
            this.submitted = false;
            this.isOK = true;
          } else {
            this.isOK = false;
            console.error('Error al subir el archivo:', result.descripcion);
          }
        },
        error => {
          console.error('Error al subir el archivo', error);
        }
      );
    } else {
      this.contactForm.markAllAsTouched();
    }
    this.saving = false;
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


