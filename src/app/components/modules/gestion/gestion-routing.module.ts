import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IniciarSeguimientoComponent } from './iniciar-seguimiento/iniciar-seguimiento.component';

const routes: Routes = [
  { path: 'iniciar_seguimiento', component: IniciarSeguimientoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionRoutingModule { }
