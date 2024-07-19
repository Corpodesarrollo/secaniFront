import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearcontactoComponent } from './crearcontacto/crearcontacto.component';

const routes: Routes = [
  {
    path: 'crearcontacto',
    component: CrearcontactoComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NnaRoutingModule { }
