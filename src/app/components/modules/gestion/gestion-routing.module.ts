import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultarSeguimientosComponent } from './consultar-seguimientos/consultar-seguimientos.component';
import { DetalleSeguimientosComponent } from './detalle-seguimientos/detalle-seguimientos.component';

const routes: Routes = [
  { path: 'seguimiento', component: ConsultarSeguimientosComponent },
  { path: 'detalle_seguimiento/:idSeguimiento', component: DetalleSeguimientosComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionRoutingModule { }
