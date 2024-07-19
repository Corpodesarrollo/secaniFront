import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearContactoComponent } from './crear-contacto/crear-contacto.component';

const routes: Routes = [
  { path: 'crear_contacto', component: CrearContactoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
