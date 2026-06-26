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
import { ModuloGuard } from '../../../services/modulo.guard';
import { permisoGuard } from '../../../guards/permiso.guard';

const routes: Routes = [
  { 
    path: 'permisos', 
    component: PermisosComponent,
    canActivate: [ModuloGuard, permisoGuard],
    data: {
      path: 'administracion/permisos',
      permiso: 'canView'
    } 
  },
  {
    path: 'lista_parametricas',
    children: [
      { 
        path: '', component: 
        ListasParametricasComponent,
        canActivate: [ModuloGuard, permisoGuard],
        data: {
          path: 'administracion/lista_parametricas',
          permiso: 'canView'
        }
      },
      { 
        path: ':id', 
        component: ListaParametricaComponent, 
        canActivate: [ModuloGuard, permisoGuard],
        data: {
          path: 'administracion/lista_parametricas',
          permiso: 'canView'
        }
      },
      { 
        path: ':id/historico', 
        component: ListaParametricaHistoricoComponent,
        canActivate: [ModuloGuard, permisoGuard],
        data: {
          path: 'administracion/lista_parametricas',
          permiso: 'canView'
        }
      },
      { 
        path: ':id/items', 
        component: ListaParametricaItemsComponent,
        canActivate: [ModuloGuard, permisoGuard],
        data: {
          path: 'administracion/lista_parametricas',
          permiso: 'canView'
        } 
      },
      { path: '**', redirectTo: '' }
    ]
  },
  {
    path: 'plantilla_de_correo',
    children: [
      { 
        path: '', component: PlantillasCorreoComponent, 
        canActivate: [ModuloGuard, permisoGuard],
        data: {
          path: 'administracion/plantilla_de_correo',
          permiso: 'canView'
        } 
      },
      { 
        path: ':id/historico', 
        component: PlantillaCorreoHistoricoComponent,
        canActivate: [ModuloGuard, permisoGuard],
        data: {
          path: 'administracion/plantilla_de_correo',
          permiso: 'canView'
        } 
      },
      { 
        path: 'nueva', 
        component: NuevaPlantillaCorreoComponent,
        canActivate: [ModuloGuard, permisoGuard],
        data: {
          path: 'administracion/plantilla_de_correo',
          permiso: 'canAdd'
        } 
      },
      { 
        path: ':id/editar', 
        component: NuevaPlantillaCorreoComponent,
        canActivate: [ModuloGuard, permisoGuard],
        data: {
          path: 'administracion/plantilla_de_correo',
          permiso: 'canEdit'
        } 
      },
      { 
        path: '**', redirectTo: '' 
      }
    ]
  },
  { 
    path: 'asignacion_de_seguimiento', 
    component: AsignacionSeguimientoComponent,
    canActivate: [ModuloGuard, permisoGuard],
    data: {
      path: 'administracion/asignacion_de_seguimiento',
      permiso: 'canView'
    } 
  },
  { path: '**', redirectTo: 'permisos' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule { }
