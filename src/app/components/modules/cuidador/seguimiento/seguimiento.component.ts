import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { TimelineModule } from 'primeng/timeline';

@Component({
  selector: 'app-seguimiento',
  standalone: true,
  imports: [ CommonModule, TimelineModule ],
  templateUrl: './seguimiento.component.html',
  styleUrl: './seguimiento.component.css'
})
export class SeguimientoComponent {

  public pasoActual: number = 1;
  public eventos: any[] = [
    { status: 'Solicitado', date: '12/06/2024' },
    { status: 'Agente asignado', date: '12/06/2024' },
    { status: 'Agendado', date: '12/06/2024' },
    { status: 'Contactado', date: '12/06/2024' }
  ];
}
