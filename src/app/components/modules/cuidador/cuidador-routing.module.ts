import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NuevoSeguimientoComponent } from './nuevo-seguimiento/nuevo-seguimiento.component';
import { SeguimientoComponent } from './seguimiento/seguimiento.component';
import { EstadoSeguimientoComponent } from '../gestion/estado-seguimiento/estado-seguimiento.component';
const routes: Routes = [
  {
    path: 'seguimientos',
    children: [
      { path: '', component: EstadoSeguimientoComponent },
      { path: 'nuevo', component: NuevoSeguimientoComponent },
      { path: ':id', component: SeguimientoComponent },
      { path: '**', redirectTo: '' }
    ]
  },
  {
    path: '**',
    redirectTo: 'seguimientos'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuidadorRoutingModule { }
