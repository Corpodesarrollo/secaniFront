import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SeguimientosComponent } from './seguimientos/seguimientos.component';
import { NuevoSeguimientoComponent } from './nuevo-seguimiento/nuevo-seguimiento.component';

const routes: Routes = [
  {
    path: 'seguimientos',
    children: [
      { path: '', component: SeguimientosComponent },
      { path: 'nuevo', component: NuevoSeguimientoComponent },
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
