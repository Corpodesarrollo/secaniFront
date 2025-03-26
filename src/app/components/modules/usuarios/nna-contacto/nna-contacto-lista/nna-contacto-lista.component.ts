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
  styleUrls: ['./nna-contacto-lista.component.css']
})
export class NnaContactoListaComponent {
  @Input() nnaId: number = 0;
  @Input() contactoId: number = 0;
  @Input() disable: boolean = false;
  @Output() lista = new EventEmitter<any>();
  
  displayModalContacto: boolean = false;

  visualizars!: any;
  first = 0;
  rows = 10;
  listadoContacto: ContactoNNA[] = [];
  contacto: ContactoNNA = {
    id: 0,
    nnaId: 0,
    nombres: '',
    parentescoId: 0,
    parentesco: '',
    cuidador: false,
    telefonos: '',
    email: '',
    estado: false
  };

  constructor(private gs: GenericService) {
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['nnaId'] && changes['nnaId'].currentValue) {
      this.recargarLista();
    }

    if (changes['listadoContacto'] && changes['listadoContacto'].currentValue) {
      this.enviarLista();
    }
  }

  obtenerContacto(data: ContactoNNA){
    console.log("editarContacto",data);
    this.listadoContacto.push(data);
    this.enviarLista();
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  eliminarContacto(contacto: ContactoNNA) {
    this.listadoContacto = this.listadoContacto.filter(x => x !== contacto);
  }

  editarContacto(id: number) {
    this.displayModalContacto = true;
    if(this.nnaId > 0){
      this.contactoId = id;
    } 
  }

  onModalHide(){
  }

  closeModal() {
    this.displayModalContacto = false; // Cierra el modal
    if(this.nnaId > 0){
      console.log("nnaId",this.nnaId);
      this.recargarLista();
    }
  }

  recargarLista(){
    this.gs.getAsync('ContactoNNAs/ObtenerByNNAId', `/${this.nnaId}`, apis.nna).then((data: any) => {
      this.listadoContacto = data.datos;
    }).catch((error: any) => {
      console.error('Error fetching contact list', error);
    });
  }

  enviarLista(){
    this.lista.emit(this.listadoContacto);
  }

  nuevoContacto(){
    this.displayModalContacto = true;
    this.contactoId = 0;
  }
}