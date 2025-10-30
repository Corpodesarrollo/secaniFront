import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MiPerfilComponent } from './mi-perfil/mi-perfil.component';
import { permisoGuard } from '../../../guards/permiso.guard';
import { ModuloGuard } from '../../../services/modulo.guard';

const routes: Routes = [
  { 
    path: '', 
    component: MiPerfilComponent,
    canActivate: [ModuloGuard],
    data: {
      path: 'perfil',
      permiso: 'canView'
    } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerfilRoutingModule { }
