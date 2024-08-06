import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearContactoComponent } from './crear-contacto/crear-contacto.component';
import { HistoricoNnaComponent } from './historico-nna/historico-nna.component';
import { CrearNnaComponent } from './crear-nna/crear-nna.component';

const routes: Routes = [
  { path: 'crear_contacto', component: CrearContactoComponent },
  { path: 'historico_nna', component: HistoricoNnaComponent },
  { path: 'crear_nna', component: CrearNnaComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
