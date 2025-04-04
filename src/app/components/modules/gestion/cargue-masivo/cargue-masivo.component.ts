import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { BotonNotificacionComponent } from '../../boton-notificacion/boton-notificacion.component';
import { CargueMasivoService } from '../../../../services/cargue-masivo.service';

@Component({
  selector: 'app-cargue-masivo',
  standalone: true,
  imports: [BotonNotificacionComponent, ButtonModule, CommonModule, ToastModule],
  templateUrl: './cargue-masivo.component.html',
  styleUrl: './cargue-masivo.component.css',
  providers: [MessageService],
})
export class CargueMasivoComponent {
  public selectedFile: File | null = null;
  public cargando: boolean = false;

  constructor(private cargueMasivoServicio: CargueMasivoService, private messageService: MessageService) {}

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input && input.files) {
      const file = input.files[0];

      const allowedExtensions = ['.csv', '.xlsx', '.xls'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (fileExtension && allowedExtensions.includes(`.${fileExtension}`)) {
        this.selectedFile = file;
      } else {
        this.selectedFile = null;
        this.messageService.add({
          severity: 'warn',
          summary: 'Archivo inválido',
          detail: 'El archivo debe tener una extensión válida (.csv, .xlsx, .xls).',
        });
      }
    }

  }

  uploadFile() {
    if (!this.selectedFile) {
      return this.messageService.add({
        severity: 'error',
        summary: 'Formulario inválido',
        detail: 'Debes seleccionar un archivo antes de subirlo.',
      });
    }

    this.cargando = true;
    this.cargueMasivoServicio.cargarArchivo(this.selectedFile)
      .then((response) => {
        if (response.estado === 'Procesada') {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'El archivo ha sido procesado con éxito' });
          this.selectedFile = null;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response.estado });
        }
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado.';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
        });
      })
      .finally(() => {
        this.cargando = false;
      });
  }

  cancelUpload() {
    this.selectedFile = null;
    this.messageService.add({
      severity: 'info',
      summary: 'Cancelado',
      detail: 'Se canceló la carga del archivo.',
    });
  }
}
