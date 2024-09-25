import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DragDropModule } from 'primeng/dragdrop';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { IntentoComponent } from './intento/intento.component';
import { IntentoSeguimientoService } from './intento-seguimiento.services';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { InfoSeguimientoNnaComponent } from '../../gestion/seguimientos/info-seguimiento-nna/info-seguimiento-nna.component';

import { UsuariosModule } from '../usuarios.module';
import { TpParametros } from '../../../../core/services/tpParametros';

@Component({
  selector: 'app-intento-seguimiento',
  templateUrl: './intento-seguimiento.component.html',
  styleUrls: ['./intento-seguimiento.component.css'],
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule,
    FullCalendarModule, DragDropModule, CardModule, DialogModule, ButtonModule, DropdownModule, InputTextareaModule, IntentoComponent, TableModule, PaginatorModule,InfoSeguimientoNnaComponent, UsuariosModule]
})
export class IntentoSeguimientoComponent implements OnInit {
  @ViewChild(IntentoComponent) intentoComponent!: IntentoComponent;
  seguimiento!: any;
  contactos!: any;
  intentos!: any;

  displayModalContacto: boolean = false;

  parentesco: any;
  nnaId = 0;

  constructor(public servicios: IntentoSeguimientoService, public TpParametros: TpParametros) { }


  async ngOnInit() {
    let id_seguimiento = history.state.id_seguimiento;
    console.log('id_seguimiento ', id_seguimiento, history);

    //id_seguimiento = 5;
    //TODO: operar con el id_seguimiento recibido
    this.seguimiento = await this.servicios.GetSeguimientoById(id_seguimiento);
    this.nnaId = this.seguimiento.nnaId;
    this.NNaCargado = await this.servicios.GetNNaById(this.nnaId);

    this.parentesco = await this.TpParametros.getTPParentesco();
    //Obtenemos valores para las 2 grillas de datos
    this.contactos = await this.servicios.GetIntentoContactoAgrupado(this.nnaId);
    this.intentos = await this.servicios.GetIntentosContactoNNA(this.nnaId);

    this.intentos = this.intentos.sort((a: any, b: any) => {
      return new Date(b.fechaIntento).getTime() - new Date(a.fechaIntento).getTime();
    });
    console.log("data", this.seguimiento, this.contactos)
    console.log("intentos", this.intentos)
    console.log('nnaId enviada', this.nnaId);
  }


  /*
  CODIGO NUEVO  INTENTOS
  */
  ContactoNNA = {};
  NNaCargado = {};
  displayModalIntento: boolean = false;

  async  cargarIntento( item: any){
    this.displayModalIntento = true;

    this.ContactoNNA = item;

    //console.log( this.ContactoNNA)
  }

  recargarHistorial(){
    this.displayModalIntento = false;
    this.ngOnInit();
  }


  valor_cuidador(valor: any){
    if(valor){
      return "SI";
    }
    else{
      return "NO";
    }

  }

  valor_tipoIntento(valor: any){

    if(valor == 0){
      return "EXITOSO";
    }
    else{
      return "FALLIDO";
    }

  }

  onModalHide(){
    this.resetChildState();
  }

  resetChildState() {
    if (this.intentoComponent) {
      this.intentoComponent.resetFormState();
    }
  }

  formatDateTimeForSQLServer(dateString: string): string {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses de 0 a 11
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }


  nnaFormCrearSinActivar = false;
  async handleDataContacto(data: any) {
    //this.listadoContacto = data;
    console.log('Data received from child handleDataContacto:', 'Crear nna contacto', data);
  }

  nuevoContacto(){
    this.displayModalContacto = true;
  }


  getNombreParentesco(parentescoId: string): string {

    const parentesco = this.parentesco.find((item: any) => item.codigo == parentescoId);
    return parentesco ? parentesco.nombre : '';
  }
}
