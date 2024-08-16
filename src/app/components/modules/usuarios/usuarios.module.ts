import { NgModule } from '@angular/core';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { HistoricoNnaComponent } from './historico-nna/historico-nna.component';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { CrearNnaComponent } from './crear-nna/crear-nna.component';
import { CrearContactoComponent } from './crear-contacto/crear-contacto.component';

import { CommonModule } from '@angular/common';
import { BotonNotificacionComponent } from '../boton-notificacion/boton-notificacion.component';
import { DialogValidarExistenciaComponent } from './crear-nna/model/dialog-validar-existencia/dialog-validar-existencia.component';
import { DialogCrearNnaMsgRolAgenteComponent } from './crear-nna/model/dialog-crear-nna-msg-rol-agente/dialog-crear-nna-msg-rol-agente.component';
import { DialogCrearNnaMsgRolCoordinadorComponent } from './crear-nna/model/dialog-crear-nna-msg-rol-coordinador/dialog-crear-nna-msg-rol-coordinador.component';
import { DialogNnaMsgSeguimientoComponent } from '../dialog-nna-msg-seguimiento/dialog-nna-msg-seguimiento.component';
import { DialogCrearContactoComponent } from './dialog-crear-contacto/dialog-crear-contacto.component';
import { BrowserModule } from '@angular/platform-browser';
import { CrearNnaAgregarContactoComponent } from './crear-nna-agregar-contacto/crear-nna-agregar-contacto.component';
import { RadioButtonModule } from 'primeng/radiobutton';



@NgModule({
  declarations: [
    HistoricoNnaComponent,    
    CrearNnaComponent,
    CrearContactoComponent,
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

    /**Component standalone */
    BotonNotificacionComponent,
    DialogValidarExistenciaComponent,
    DialogCrearNnaMsgRolAgenteComponent,
    DialogCrearNnaMsgRolCoordinadorComponent,
    DialogNnaMsgSeguimientoComponent,
    DialogCrearContactoComponent
  ]
})
export class UsuariosModule { }
