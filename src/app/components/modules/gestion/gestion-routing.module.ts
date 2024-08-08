import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultarSeguimientosComponent } from './consultar-seguimientos/consultar-seguimientos.component';
import { SeguimientoDatosComponent } from './seguimientos/seguimiento-datos/seguimiento-datos.component';
import { SeguimientoEstadoComponent } from './seguimientos/seguimiento-estado/seguimiento-estado.component';

const routes: Routes = [
  { path: 'seguimiento', component: ConsultarSeguimientosComponent },
  { path: 'seguimiento/datos-seguimiento', component: SeguimientoDatosComponent },
  { path: 'seguimiento/estado-seguimiento', component: SeguimientoEstadoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionRoutingModule { }
