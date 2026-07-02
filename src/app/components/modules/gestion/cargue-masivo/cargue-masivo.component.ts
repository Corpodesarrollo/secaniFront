import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { BotonNotificacionComponent } from '../../boton-notificacion/boton-notificacion.component';
import { CargueMasivoService } from '../../../../services/cargue-masivo.service';
import { PermisoDirective } from '../../../../directives/permiso.directive';

@Component({
  selector: 'app-cargue-masivo',
  standalone: true,
  imports: [BotonNotificacionComponent, ButtonModule, CommonModule, ToastModule, PermisoDirective],
  templateUrl: './cargue-masivo.component.html',
  styleUrl: './cargue-masivo.component.css',
  providers: [MessageService],
})
export class CargueMasivoComponent {
  public selectedFile: File | null = null;
  public cargando: boolean = false;
  public errorTitulo: string = '';
  public errores: string[] = [];

  constructor(private cargueMasivoServicio: CargueMasivoService, private messageService: MessageService) {}

  private resetErrores() {
    this.errorTitulo = '';
    this.errores = [];
  }

  // RQ-10-HU04: parsea Estado del backend en titulo + lista cuando hay multiples errores de columnas
  private mostrarErrorBackend(estado: string) {
    const limpio = (estado || '').replace(/^Ocurrió un error al procesar el archivo:\s*/i, '').trim();
    if (limpio.includes('|')) {
      const partes = limpio.split('|').map(s => s.trim()).filter(Boolean);
      this.errorTitulo = partes.shift() || 'Error en la validación del archivo';
      this.errores = partes;
    } else {
      this.errorTitulo = limpio || 'Error al procesar el archivo';
      this.errores = [];
    }
    this.messageService.add({ severity: 'error', summary: 'Error', detail: this.errorTitulo, life: 8000 });
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input && input.files) {
      const file = input.files[0];

      const allowedExtensions = ['.csv', '.xlsx'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (fileExtension === 'xls') {
        this.selectedFile = null;
        this.messageService.add({
          severity: 'warn',
          summary: 'Formato no soportado',
          detail: 'El formato .xls (Excel 97-2003) no es compatible. Abra el archivo en Excel y guarde como .xlsx.',
          life: 7000
        });
      } else if (fileExtension && allowedExtensions.includes(`.${fileExtension}`)) {
        this.selectedFile = file;
        this.resetErrores();
      } else {
        this.selectedFile = null;
        this.messageService.add({
          severity: 'warn',
          summary: 'Archivo inválido',
          detail: 'El archivo debe tener una extensión válida (.csv o .xlsx).',
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

    this.resetErrores();
    this.cargando = true;
    this.cargueMasivoServicio.cargarArchivo(this.selectedFile)
      .then((response) => {
        if (response.estado === 'Procesada') {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'El archivo ha sido procesado con éxito' });
          this.selectedFile = null;
        } else {
          this.mostrarErrorBackend(response.estado);
        }
      })
      .catch((error) => {
        const errorMessage = error?.response?.data?.message || error?.response?.data?.estado || 'Ocurrió un error inesperado al procesar el archivo.';
        this.mostrarErrorBackend(errorMessage);
      })
      .finally(() => {
        this.cargando = false;
      });
  }

  cancelUpload() {
    this.selectedFile = null;
    this.resetErrores();
    this.messageService.add({
      severity: 'info',
      summary: 'Cancelado',
      detail: 'Se canceló la carga del archivo.',
    });
  }
}
