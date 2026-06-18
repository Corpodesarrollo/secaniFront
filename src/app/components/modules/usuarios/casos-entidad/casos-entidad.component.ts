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
import { User } from '../../../../core/services/user';


@Component({
  selector: 'app-casos-entidad',
  templateUrl: './casos-entidad.component.html',
  styleUrls: ['./casos-entidad.component.css'],
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule,
      CardModule, DialogModule, ButtonModule, TableModule, PaginatorModule, TagModule,  ]
})
export class CasosEntidadComponent implements OnInit {
  // BUG-smoke-A: p-table [value]="casos" llama .slice() en render inicial. Antes era {} → TypeError
  // hasta que ngOnInit async asignaba el array real.
  casos: any[] = [];
  displayModal: boolean = false;

  estadosSeguimiento = [];

  // Bug 2026-06-17: antes hardcoded eapbID=1/epsID=1 -> tabla vacia para cualquier usuario real.
  // Resolvemos el TPEAPB.Id desde el NIT del usuario logueado (igual que dashboard-eapb).
  eapbID: number = 0;
  epsID: number = 0;
  xUser = new User();

  constructor(public servicio: CasosEntidadService) { }

  async ngOnInit() {
    this.estadosSeguimiento = await this.servicio.GetEstadoSeguimiento();

    const nit = this.xUser.enterpriseIdentification;
    if (nit) {
      try {
        const id = await this.servicio.GetEAPBIdByNit(nit);
        if (id) {
          const idNum = Number(id);
          // Usar el mismo TPEAPB.Id para los dos filtros: el backend aplica OR
          // entre NNA.EAPBId y NNA.EPSId, asi el caso aparece sin importar cual
          // de los dos foreign keys apunte a la entidad del usuario.
          this.eapbID = idNum;
          this.epsID = idNum;
        }
      } catch (err) {
        console.error('No se pudo resolver TPEAPB.Id por NIT', nit, err);
      }
    }

    if (!this.eapbID && !this.epsID) {
      console.warn('casos-entidad: no se resolvio el Id de la entidad (NIT=' + nit + '). No se cargan casos.');
      return;
    }

    this.casos = await this.servicio.GetListaCasos(this.eapbID, this.epsID);
    console.log('casos ', this.casos);
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
