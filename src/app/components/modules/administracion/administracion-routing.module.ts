import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermisosComponent } from '../administracion/permisos/permisos.component';

import { ListasParametricasComponent } from './listas-parametricas/listas-parametricas.component';
import { ListaParametricaComponent } from './lista-parametrica/lista-parametrica.component';
import { ListaParametricaHistoricoComponent } from './lista-parametrica-historico/lista-parametrica-historico.component';
import { ListaParametricaItemsComponent } from './lista-parametrica-items/lista-parametrica-items.component';

const routes: Routes = [
  { path: 'permisos', component: PermisosComponent },
  {
    path: 'lista_parametricas',
    children: [
      { path: '', component: ListasParametricasComponent },
      { path: ':id', component: ListaParametricaComponent },
      { path: ':id/historico', component: ListaParametricaHistoricoComponent },
      { path: ':id/items', component: ListaParametricaItemsComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule { }
