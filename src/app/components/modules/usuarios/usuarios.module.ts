import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { HistoricoNnaComponent } from './historico-nna/historico-nna.component';
import { TableModule } from 'primeng/table';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DialogValidarExistenciaComponent } from './dialog-validar-existencia/dialog-validar-existencia.component';
import { CrearNnaComponent } from './crear-nna/crear-nna.component';
import { CrearContactoComponent } from './crear-contacto/crear-contacto.component';
import { DialogCrearContactoComponent } from './dialog-crear-contacto/dialog-crear-contacto.component';



@NgModule({
  declarations: [
    HistoricoNnaComponent,
    DialogValidarExistenciaComponent,
    DialogCrearContactoComponent,
    CrearNnaComponent,
    CrearContactoComponent

  ],
  imports: [
    UsuariosRoutingModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    

    /**PrimeNG*/
    TableModule,
    ButtonModule,
    DialogModule
  ]
})
export class UsuariosModule { }
