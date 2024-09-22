import { NgModule } from '@angular/core';

import { CommonModule, DatePipe } from '@angular/common';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { HistoricoNnaComponent } from './nna/historico-nna/historico-nna.component';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { CrearNnaComponent } from './nna/crear-nna/crear-nna.component';


import { BotonNotificacionComponent } from '../boton-notificacion/boton-notificacion.component';
import { DialogValidarExistenciaComponent } from './nna/crear-nna/dialog/dialog-validar-existencia/dialog-validar-existencia.component';
import { DialogCrearNnaMsgRolAgenteComponent } from './nna/crear-nna/dialog/dialog-crear-nna-msg-rol-agente/dialog-crear-nna-msg-rol-agente.component';
import { DialogCrearNnaMsgRolCoordinadorComponent } from './nna/crear-nna/dialog/dialog-crear-nna-msg-rol-coordinador/dialog-crear-nna-msg-rol-coordinador.component';
import { DialogNnaMsgSeguimientoComponent } from '../dialog-nna-msg-seguimiento/dialog-nna-msg-seguimiento.component';
import { DialogCrearContactoComponent } from './nna-contacto/dialog-crear-contacto/dialog-crear-contacto.component';
import { BrowserModule } from '@angular/platform-browser';
import { CrearNnaAgregarContactoComponent } from './nna-contacto/crear-nna-agregar-contacto/crear-nna-agregar-contacto.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@NgModule({
  declarations: [
    HistoricoNnaComponent,
    CrearNnaComponent,
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

    /**Component standalone */
    BotonNotificacionComponent,
    DialogValidarExistenciaComponent,
    DialogCrearNnaMsgRolAgenteComponent,
    DialogCrearNnaMsgRolCoordinadorComponent,
    DialogNnaMsgSeguimientoComponent,
    DialogCrearContactoComponent
  ],
  providers: [
    DatePipe // <-- Agrega DatePipe aquí
  ],
  exports: [CrearNnaAgregarContactoComponent],
})
export class UsuariosModule { }
