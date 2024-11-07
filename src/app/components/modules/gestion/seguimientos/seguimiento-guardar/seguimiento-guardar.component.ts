import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TpParametros } from '../../../../../core/services/tpParametros';
import { GenericService } from '../../../../../services/generic.services';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-seguimiento-guardar',
  standalone: true,
  imports: [CommonModule, CalendarModule, ReactiveFormsModule, FormsModule, DialogModule, InputTextModule],
  templateUrl: './seguimiento-guardar.component.html',
  styleUrl: './seguimiento-guardar.component.css'
})
export class SeguimientoGuardarComponent {
  @Input() show: boolean = false;

  agendarForm: FormGroup;
  submitted: boolean = false;
  fechaSugerida: Date = new Date();
  nuevaFecha: Date[] | undefined;
  nuevaHora: Date[] | undefined;
  motivo: string = '';
  isLoading: boolean = false;
  
  mensajeCarga: string = 'Cargando datos...';
  colorMensaje: string = 'text-primary';

  constructor(private fb: FormBuilder, private tp: TpParametros, private gs: GenericService) {
    this.agendarForm = this.fb.group({
      fechaSugerida: [this.fechaSugerida],
      nuevaFecha: [this.nuevaFecha],
      nuevaHora: [this.nuevaHora],
      motivo: [this.motivo]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.agendarForm.valid) {
      const formData = new FormData();
      formData.append('fechaSugerida', this.agendarForm.value.fechaSugerida);
      formData.append('nuevaFecha', this.agendarForm.value.nuevaFecha);
      formData.append('nuevaHora', this.agendarForm.value.nuevaHora);
      formData.append('motivo', this.agendarForm.value.motivo);

      // Llamada al método 'post'
      this.gs.post('Notificacion/NotificacionRespuesta', formData, "Seguimiento").subscribe(
        response => {
          console.log('Archivo subido exitosamente');
        },
        error => {
          console.error('Error al subir el archivo', error);
        }
      );
    } else {
      this.agendarForm.markAllAsTouched();
    }
  }
}
