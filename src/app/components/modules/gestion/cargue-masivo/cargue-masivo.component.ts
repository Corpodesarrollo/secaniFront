import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { BotonNotificacionComponent } from '../../boton-notificacion/boton-notificacion.component';
import { CargueMasivoService } from '../../../../services/cargue-masivo.service';

@Component({
  selector: 'app-cargue-masivo',
  standalone: true,
  imports: [BotonNotificacionComponent, ButtonModule, CommonModule],
  templateUrl: './cargue-masivo.component.html',
  styleUrl: './cargue-masivo.component.css'
})
export class CargueMasivoComponent {
  public selectedFile: File | null = null;

  constructor(private cargueMasivoServicio: CargueMasivoService) {}

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
      }
    }

  }

  uploadFile() {
    if (!this.selectedFile) return;
    this.cargueMasivoServicio.cargarArchivo(this.selectedFile);
  }

  cancelUpload() {
    this.selectedFile = null;
  }
}
