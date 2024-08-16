import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultarSeguimientosComponent } from './consultar-seguimientos/consultar-seguimientos.component';
import { SeguimientoDatosComponent } from './seguimientos/seguimiento-datos/seguimiento-datos.component';
import { SeguimientoEstadoComponent } from './seguimientos/seguimiento-estado/seguimiento-estado.component';
import { SeguimientoTrasladoComponent } from './seguimientos/seguimiento-traslado/seguimiento-traslado.component';
import { SeguimientoDificultadesComponent } from './seguimientos/seguimiento-dificultades/seguimiento-dificultades.component';
import { SeguimientoAdherenciaComponent } from './seguimientos/seguimiento-adherencia/seguimiento-adherencia.component';

const routes: Routes = [
  { path: 'seguimiento', component: ConsultarSeguimientosComponent },
  { path: 'seguimiento/datos-seguimiento', component: SeguimientoDatosComponent },
  { path: 'seguimiento/estado-seguimiento', component: SeguimientoEstadoComponent },
  { path: 'seguimiento/traslado-seguimiento', component: SeguimientoTrasladoComponent },
  { path: 'seguimiento/dificultades-seguimiento', component: SeguimientoDificultadesComponent },
  { path: 'seguimiento/adherencia-seguimiento', component: SeguimientoAdherenciaComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionRoutingModule { 
  
}
