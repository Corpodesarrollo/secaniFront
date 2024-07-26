import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { HistoricoNnaComponent } from './historico-nna/historico-nna.component';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';


@NgModule({
  declarations: [HistoricoNnaComponent],
  imports: [
    UsuariosRoutingModule
    FormsModule,
    CommonModule,

    /**PrimeNG*/
    TableModule,
    ButtonModule
  ]
})
export class UsuariosModule { }
