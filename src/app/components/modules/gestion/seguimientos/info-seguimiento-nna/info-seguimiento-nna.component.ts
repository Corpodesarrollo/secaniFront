import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { GenericService } from '../../../../../services/generic.services';
import { DatosBasicosNNA } from '../../../../../models/datosBasicosNNA.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-seguimiento-nna',
  standalone: true,
  imports: [CardModule, ButtonModule, CommonModule],
  templateUrl: './info-seguimiento-nna.component.html',
  styleUrl: './info-seguimiento-nna.component.css',
})
export class InfoSeguimientoNnaComponent {
  @Input() idNNA: number = 0;

  NNA: DatosBasicosNNA = {
    idNNA: 0,
    nombreCompleto: '',
    fechaNacimiento: new Date(),
    edad: '',
    diagnostico: '',
    fechaIngresoEstrategia: new Date(),
    fechaInicioSeguimiento: new Date(),
    tiempoTranscurrido: '',
    seguimientosRealizados: 0,
  };

  constructor(
    private repos: GenericService,
  ) { }

  ngOnInit(): void {
    this.CargarDatos();
  }

  CargarDatos() {
    this.repos.get('Seguimiento/SeguimientoNNA/', `${this.idNNA}`, 'Seguimiento').subscribe({
      next: (data: any) => {
        console.log(data);
        this.NNA = data;
      }
    });
  }
}
