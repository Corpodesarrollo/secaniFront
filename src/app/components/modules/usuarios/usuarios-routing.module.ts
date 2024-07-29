import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearContactoComponent } from './crear-contacto/crear-contacto.component';
import { EAPBComponent } from './eapb/eapb.component';

const routes: Routes = [
  { path: 'crear_contacto', component: CrearContactoComponent },
  { path: 'consultar_eapb', component:  EAPBComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
