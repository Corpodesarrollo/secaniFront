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
import { SeguimientoGestionarComponent } from './seguimientos/seguimiento-gestionar/seguimiento-gestionar.component';
import { ConsultarAlertasComponent } from './consultar-alertas/consultar-alertas.component';

const routes: Routes = [
  { path: 'seguimientos', component: ConsultarSeguimientosComponent },
  { path: 'seguimientos/datos-seguimiento/:id', component: SeguimientoDatosComponent },
  { path: 'seguimientos/estado-seguimiento/:id', component: SeguimientoEstadoComponent },
  { path: 'seguimientos/traslado-seguimiento/:id', component: SeguimientoTrasladoComponent },
  { path: 'seguimientos/dificultades-seguimiento/:id', component: SeguimientoDificultadesComponent },
  { path: 'seguimientos/adherencia-seguimiento/:id', component: SeguimientoAdherenciaComponent },
  { path: 'seguimientos/sin-diagnostico-seguimiento/:id', component: SeguimientoSinDiagnosticoComponent },
  { path: 'seguimientos/sin-tratamiento-seguimiento/:id', component: SeguimientoSinTratamientoComponent },
  { path: 'seguimientos/fallecido-seguimiento/:id', component: SeguimientoFallecidoComponent },
  { path: 'seguimientos/gestionar-seguimiento/:id', component: SeguimientoGestionarComponent },
  { path: 'detalle_seguimiento/:idSeguimiento', component: DetalleSeguimientosComponent },
  { path: 'consultar-alertas/:id', component: ConsultarAlertasComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionRoutingModule {

}
