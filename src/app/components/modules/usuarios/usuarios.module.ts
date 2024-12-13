import { NgModule } from '@angular/core';

import { CommonModule, DatePipe } from '@angular/common';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { HistoricoNnaComponent } from './nna/historico-nna/historico-nna.component';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';

import { CrearNnaComponent } from './nna/crear-nna/crear-nna.component';
import { DetalleNnaComponent } from './nna/detalle-nna/detalle-nna.component';


import { BotonNotificacionComponent } from '../boton-notificacion/boton-notificacion.component';
import { DialogValidarExistenciaComponent } from './nna/crear-nna/dialog/dialog-validar-existencia/dialog-validar-existencia.component';
import { DialogCrearNnaMsgRolAgenteComponent } from './nna/crear-nna/dialog/dialog-crear-nna-msg-rol-agente/dialog-crear-nna-msg-rol-agente.component';
import { DialogCrearNnaMsgRolCoordinadorComponent } from './nna/crear-nna/dialog/dialog-crear-nna-msg-rol-coordinador/dialog-crear-nna-msg-rol-coordinador.component';
import { DialogNnaMsgSeguimientoComponent } from '../dialog-nna-msg-seguimiento/dialog-nna-msg-seguimiento.component';
import { DialogCrearContactoComponent } from './nna-contacto/dialog-crear-contacto/dialog-crear-contacto.component';
import { BrowserModule } from '@angular/platform-browser';
import { CrearNnaAgregarContactoComponent } from './nna-contacto/crear-nna-agregar-contacto/crear-nna-agregar-contacto.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { NnaContactoListaComponent } from "./nna-contacto/nna-contacto-lista/nna-contacto-lista.component";

@NgModule({
  declarations: [
    
    CrearNnaAgregarContactoComponent

  ],
  imports: [
    UsuariosRoutingModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    /**PrimeNG*/
    TableModule,
    ButtonModule,
    DialogModule,
    RadioButtonModule,
    CalendarModule,
    ProgressSpinnerModule,
    InputTextModule,
    FloatLabelModule,
    IconFieldModule,
    InputIconModule,
    CardModule,
    AccordionModule,
    SelectButtonModule,
    DropdownModule,
    CalendarModule,
    ToastModule,
    ButtonModule,
    RippleModule,
    PaginatorModule,
    /**Component standalone */
    HistoricoNnaComponent,
    BotonNotificacionComponent,
    DialogValidarExistenciaComponent,
    DialogCrearNnaMsgRolAgenteComponent,
    DialogCrearNnaMsgRolCoordinadorComponent,
    DialogNnaMsgSeguimientoComponent,
    DialogCrearContactoComponent,
    NnaContactoListaComponent
],
  providers: [
    MessageService,
    DatePipe // <-- Agrega DatePipe aquí
  ],
  exports: [CrearNnaAgregarContactoComponent],
})
export class UsuariosModule { }
