import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CasosEntidadService } from './casos-entidad.services';


@Component({
  selector: 'app-casos-entidad',
  templateUrl: './casos-entidad.component.html',
  styleUrls: ['./casos-entidad.component.css'],
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule,
      CardModule, DialogModule, ButtonModule, TableModule, PaginatorModule, TagModule,  ]
})
export class CasosEntidadComponent implements OnInit {
  casos: any = {};
  displayModal: boolean = false;

  estadosSeguimiento = [];

  eapbID=1;
  epsID=1;

  constructor(public servicio: CasosEntidadService) { }

  async ngOnInit() {
    //TODO: IMPLEMENTAR LA FORMA EN QUE SE RECIBE EL ID DE EAPB Y EL EPS

    this.estadosSeguimiento = await this.servicio.GetEstadoSeguimiento();

    this.casos = await this.servicio.GetListaCasos(this.eapbID, this.epsID);
    console.log("casos ", this.casos);


  }

  verRespuesta(){
    this.displayModal = true;
  }


  obtenerNombreEstadoSeguimiento(id: any){
    const selectedItem = this.estadosSeguimiento.find((item: { id: number; }) => item.id === id);
    let nombre = selectedItem ? selectedItem['nombre'] : '';
    return nombre;
  }

  getBadgeColor(estadoAlerta: any): string {
    switch (estadoAlerta) {
      case 4: // Resuelta
        return ' '; // Verde
      case 1 || 2:
        return 'bg-warning'; // Amarillo
      case 3:
        return 'bg-danger'; // Rojo
      case 5:
        return 'bg-danger'; // Gris
      default:
        return 'bg-secondary'; // Por defecto
    }
  }

  valores(input: string | string[]): string[] {
    // Convert to array if the input is a string or empty string
    if (typeof input === 'string') {
      return input === '' ? [] : [input];
    }
    // Return the input directly if it's already an array
    return input;
  }

}
