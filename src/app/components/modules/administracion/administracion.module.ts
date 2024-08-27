import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';

import { AdministracionRoutingModule } from './administracion-routing.module';


@NgModule({
  declarations: [],
  imports: [
    AdministracionRoutingModule,
    RouterModule, CheckboxModule, FormsModule, CommonModule, TableModule, CardModule
  ]
})
export class AdministracionModule { }
