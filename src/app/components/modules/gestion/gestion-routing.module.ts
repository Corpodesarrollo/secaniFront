import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultarSeguimientosComponent } from './consultar-seguimientos/consultar-seguimientos.component';

const routes: Routes = [
  { path: 'seguimiento', component: ConsultarSeguimientosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionRoutingModule { }
