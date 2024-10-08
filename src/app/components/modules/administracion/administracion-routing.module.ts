import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermisosComponent } from '../administracion/permisos/permisos.component';

import { ListasParametricasComponent } from './listas-parametricas/listas-parametricas.component';
import { ListaParametricaComponent } from './lista-parametrica/lista-parametrica.component';

const routes: Routes = [
  { path: 'permisos', component: PermisosComponent },
  {
    path: 'listas-parametricas',
    children: [
      { path: '', component: ListasParametricasComponent },
      { path: ':id', component: ListaParametricaComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule { }
