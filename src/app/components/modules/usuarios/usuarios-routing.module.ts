import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearContactoComponent } from './crear-contacto/crear-contacto.component';
import { PermisosComponent } from './permisos/permisos.component';

const routes: Routes = [
  { path: 'crear_contacto', component: CrearContactoComponent },
  { path: 'permisos', component: PermisosComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
