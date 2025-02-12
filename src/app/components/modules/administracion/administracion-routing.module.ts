import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermisosComponent } from '../administracion/permisos/permisos.component';

import { ListasParametricasComponent } from './listas-parametricas/listas-parametricas.component';
import { ListaParametricaComponent } from './lista-parametrica/lista-parametrica.component';
import { ListaParametricaHistoricoComponent } from './lista-parametrica-historico/lista-parametrica-historico.component';
import { ListaParametricaItemsComponent } from './lista-parametrica-items/lista-parametrica-items.component';

import { PlantillasCorreoComponent } from './plantillas-correo/plantillas-correo.component';
import { PlantillaCorreoHistoricoComponent } from './plantilla-correo-historico/plantilla-correo-historico.component';
import { NuevaPlantillaCorreoComponent } from './nueva-plantilla-correo/nueva-plantilla-correo.component';

import { AsignacionSeguimientoComponent } from '../administracion/asignacion-seguimiento/asignacion-seguimiento.component';

const routes: Routes = [
  { path: 'permisos', component: PermisosComponent },
  {
    path: 'lista_parametricas',
    children: [
      { path: '', component: ListasParametricasComponent },
      { path: ':id', component: ListaParametricaComponent },
      { path: ':id/historico', component: ListaParametricaHistoricoComponent },
      { path: ':id/items', component: ListaParametricaItemsComponent },
      { path: '**', redirectTo: '' }
    ]
  },
  {
    path: 'plantilla_de_correo',
    children: [
      { path: '', component: PlantillasCorreoComponent },
      { path: ':id/historico', component: PlantillaCorreoHistoricoComponent },
      { path: 'nueva', component: NuevaPlantillaCorreoComponent },
      { path: ':id/editar', component: NuevaPlantillaCorreoComponent },
      { path: '**', redirectTo: '' }
    ]
  },
  { path: 'asignacion_de_seguimiento', component: AsignacionSeguimientoComponent },
  { path: '**', redirectTo: 'permisos' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule { }
