import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { HistoricoNnaComponent } from './historico-nna/historico-nna.component';
import { TableModule } from 'primeng/table';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogValidarExistenciaComponent } from './dialog-validar-existencia/dialog-validar-existencia.component';
import { CrearNnaComponent } from './crear-nna/crear-nna.component';
import { CrearContactoComponent } from './crear-contacto/crear-contacto.component';
import { DialogCrearContactoComponent } from './dialog-crear-contacto/dialog-crear-contacto.component';
import { CrearNnaAgregarContactoComponent } from './crear-nna-agregar-contacto/crear-nna-agregar-contacto.component';
import { DialogCrearNnaMsgRolAgenteComponent } from './dialog-crear-nna-msg-rol-agente/dialog-crear-nna-msg-rol-agente.component';
import { DialogCrearNnaMsgRolCoordinadorComponent } from './dialog-crear-nna-msg-rol-coordinador/dialog-crear-nna-msg-rol-coordinador.component';
import { CalendarModule } from 'primeng/calendar';
import { DialogNnaMsgSeguimientoComponent } from '../../dialog-nna-msg-seguimiento/dialog-nna-msg-seguimiento.component';




@NgModule({
  declarations: [
    HistoricoNnaComponent,

    DialogValidarExistenciaComponent,
    DialogCrearContactoComponent,
    DialogCrearNnaMsgRolAgenteComponent,
    DialogCrearNnaMsgRolCoordinadorComponent,
    DialogNnaMsgSeguimientoComponent,

    CrearNnaComponent,
    CrearContactoComponent,
    CrearNnaAgregarContactoComponent,


  ],
  imports: [
    UsuariosRoutingModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    DialogModule,

    /**PrimeNG*/
    TableModule,
    ButtonModule,
    CalendarModule,
    RadioButtonModule
  ]
})
export class UsuariosModule { }
