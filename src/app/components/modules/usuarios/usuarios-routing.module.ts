import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearContactoComponent } from './crear-contacto/crear-contacto.component';
import { HistoricoNnaComponent } from './historico-nna/historico-nna.component';

const routes: Routes = [
  { path: 'crear_contacto', component: CrearContactoComponent }
  { path: 'historico_nna', component: HistoricoNnaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
