import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NuevoSeguimientoComponent } from './nuevo-seguimiento/nuevo-seguimiento.component';
import { SeguimientoComponent } from './seguimiento/seguimiento.component';
import { EstadoSeguimientoComponent } from '../gestion/estado-seguimiento/estado-seguimiento.component';
import { permisoGuard } from '../../../guards/permiso.guard';
const routes: Routes = [
  {
    path: 'seguimientos',
    children: [
      { 
        path: '', 
        component: EstadoSeguimientoComponent,
        canActivate: [permisoGuard],
        data: {
          path: 'cuidador/seguimientos',
          permiso: 'canView'
        }  
      },
      { 
        path: 'nuevo', 
        component: NuevoSeguimientoComponent,
        canActivate: [permisoGuard],
        data: {
          path: 'cuidador/seguimientos',
          permiso: 'canAdd'
        } 
      },
      { 
        path: ':id', 
        component: SeguimientoComponent,
        canActivate: [permisoGuard],
        data: {
          path: 'cuidador/seguimientos',
          permiso: 'canView'
        } 
      },
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
