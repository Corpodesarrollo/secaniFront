import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultarSeguimientosComponent } from './consultar-seguimientos/consultar-seguimientos.component';
import { SeguimientoDatosComponent } from './seguimientos/seguimiento-datos/seguimiento-datos.component';
import { SeguimientoEstadoComponent } from './seguimientos/seguimiento-estado/seguimiento-estado.component';
import { SeguimientoTrasladoComponent } from './seguimientos/seguimiento-traslado/seguimiento-traslado.component';
import { SeguimientoDificultadesComponent } from './seguimientos/seguimiento-dificultades/seguimiento-dificultades.component';
import { SeguimientoAdherenciaComponent } from './seguimientos/seguimiento-adherencia/seguimiento-adherencia.component';
import { SeguimientoSinDiagnosticoComponent } from './seguimientos/seguimiento-sin-diagnostico/seguimiento-sin-diagnostico.component';
import { SeguimientoSinTratamientoComponent } from './seguimientos/seguimiento-sin-tratamiento/seguimiento-sin-tratamiento.component';
import { SeguimientoFallecidoComponent } from './seguimientos/seguimiento-fallecido/seguimiento-fallecido.component';
import { DetalleSeguimientosComponent } from './detalle-seguimientos/detalle-seguimientos.component';

const routes: Routes = [
  { path: 'seguimientos', component: ConsultarSeguimientosComponent },
  { path: 'seguimientos/datos-seguimiento', component: SeguimientoDatosComponent },
  { path: 'seguimientos/estado-seguimiento', component: SeguimientoEstadoComponent },
  { path: 'seguimientos/traslado-seguimiento', component: SeguimientoTrasladoComponent },
  { path: 'seguimientos/dificultades-seguimiento', component: SeguimientoDificultadesComponent },
  { path: 'seguimientos/adherencia-seguimiento', component: SeguimientoAdherenciaComponent },
  { path: 'seguimientos/sin-diagnostico-seguimiento', component: SeguimientoSinDiagnosticoComponent },
  { path: 'seguimientos/sin-tratamiento-seguimiento', component: SeguimientoSinTratamientoComponent },
  { path: 'seguimientos/fallecido-seguimiento', component: SeguimientoFallecidoComponent },
  { path: 'seguimientos', component: ConsultarSeguimientosComponent },
  { path: 'detalle_seguimiento/:idSeguimiento', component: DetalleSeguimientosComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionRoutingModule {

}
