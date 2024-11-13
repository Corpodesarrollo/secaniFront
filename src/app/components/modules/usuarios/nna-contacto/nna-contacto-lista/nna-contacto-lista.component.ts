import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DialogCrearContactoComponent } from "../dialog-crear-contacto/dialog-crear-contacto.component";
import { GenericService } from '../../../../../services/generic.services';
import { apis } from '../../../../../models/apis.model';
import { ContactoNNA } from '../../../../../models/contactoNNA.model';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-nna-contacto-lista',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule, DialogCrearContactoComponent],
  templateUrl: './nna-contacto-lista.component.html',
  styleUrl: './nna-contacto-lista.component.css'
})
export class NnaContactoListaComponent {
  @Input() nnaId: number = 0;
  @Input() contactoId: number = 0;
  @Output() dataToParent: any = new EventEmitter<any>(); // Emitir datos al padre
  
  displayModalContacto: boolean = false;

  visualizars!: any;
  first = 0;
  rows = 10;
  listadoContacto: ContactoNNA[] = [];

  constructor(private gs: GenericService) {
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['nnaId'] && changes['nnaId'].currentValue) {
      this.recargarLista();
    }
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  editarContacto(id: number) {
    this.displayModalContacto = true;
    this.contactoId = id;
  }

  onModalHide(){
  }

  closeModal() {
    this.displayModalContacto = false; // Cierra el modal
    this.recargarLista();
  }

  recargarLista(){
    this.gs.getAsync('ContactoNNAs/ObtenerByNNAId', `/${this.nnaId}`, apis.nna).then((data: any) => {
      this.listadoContacto = data.datos;
    }).catch((error: any) => {
      console.error('Error fetching contact list', error);
    });
  }

  nuevoContacto(){
    this.displayModalContacto = true;
    this.contactoId = 0;
  }
}