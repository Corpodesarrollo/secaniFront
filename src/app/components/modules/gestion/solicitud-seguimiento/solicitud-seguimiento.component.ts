import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-solicitud-seguimiento',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './solicitud-seguimiento.component.html',
  styleUrl: './solicitud-seguimiento.component.css'
})
export class SolicitudSeguimientoComponent {
  solicitante = {
    nombre: 'María Bustamante',
    telefono: '320 655 42 88',
  };

  fechaSolicitud: Date = new Date('2024-04-19');
  observacion: string =
    'Hace 3 semanas me diagnosticaron al niño con Leucemia pero me dicen que no tienen citas próximas para iniciar el tratamiento, que toca esperar.';
  conDiagnostico: boolean = true;
  anexoUrl: string = '/path/to/Anexo-Diagnostico.pdf';
}
