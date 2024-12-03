import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SeguimientosComponent } from './seguimientos/seguimientos.component';
import { NuevoSeguimientoComponent } from './nuevo-seguimiento/nuevo-seguimiento.component';
import { SeguimientoComponent } from './seguimiento/seguimiento.component';
import { CuidadoresComponent } from '../usuarios/cuidadores/cuidadores.component';

const routes: Routes = [
  {
    path: 'seguimientos',
    children: [
      { path: '', component: SeguimientosComponent },
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
