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
import { CargueMasivoComponent } from './cargue-masivo/cargue-masivo.component';
import { confirmExitGuard } from './seguimientos/guards/confirm-exit.guard';
import { permisoGuard } from '../../../guards/permiso.guard';

const routes: Routes = [
  { 
    path: 'gestion', 
    component: CargueMasivoComponent,
    canActivate: [permisoGuard],
    data: {
      path: 'gestion',
      permiso: 'canView'
    }
  },
  { 
    path: 'seguimientos', 
    component: ConsultarSeguimientosComponent,
    canActivate: [permisoGuard],
    data: {
      path: 'gestion/seguimientos',
      permiso: 'canView'
    } 
  },
  { 
    path: 'seguimientos/datos-seguimiento/:idNNA/:idContacto', 
    component: SeguimientoDatosComponent, 
    canDeactivate: [confirmExitGuard],
    canActivate: [permisoGuard],
    data: {
      path: 'gestion/seguimientos',
      permiso: 'canView'
    } 
  },
  { 
    path: 'seguimientos/estado-seguimiento/:id', 
    component: SeguimientoEstadoComponent, 
    canDeactivate: [confirmExitGuard],
    canActivate: [permisoGuard],
    data: {
      path: 'gestion/seguimientos',
      permiso: 'canView'
    } 
  },
  { 
    path: 'seguimientos/traslado-seguimiento/:id', 
    component: SeguimientoTrasladoComponent, 
    canDeactivate: [confirmExitGuard],
    canActivate: [permisoGuard],
    data: {
      path: 'gestion/seguimientos',
      permiso: 'canView'
    } 
  },
  { 
    path: 'seguimientos/dificultades-seguimiento/:id', 
    component: SeguimientoDificultadesComponent, 
    canDeactivate: [confirmExitGuard],
    canActivate: [permisoGuard],
    data: {
      path: 'gestion/seguimientos',
      permiso: 'canView'
    }
  },
  { 
    path: 'seguimientos/adherencia-seguimiento/:id', 
    component: SeguimientoAdherenciaComponent, 
    canDeactivate: [confirmExitGuard],
    canActivate: [permisoGuard],
    data: {
      path: 'gestion/seguimientos',
      permiso: 'canView'
    }
  },
  { 
    path: 'seguimientos/sin-diagnostico-seguimiento/:id', 
    component: SeguimientoSinDiagnosticoComponent,
    canActivate: [permisoGuard],
    data: {
      path: 'gestion/seguimientos',
      permiso: 'canView'
    }
  },
  { 
    path: 'seguimientos/sin-tratamiento-seguimiento/:id', 
    component: SeguimientoSinTratamientoComponent,
    canActivate: [permisoGuard],
    data: {
      path: 'gestion/seguimientos',
      permiso: 'canView'
    }
  },
  { 
    path: 'seguimientos/fallecido-seguimiento/:id', 
    component: SeguimientoFallecidoComponent,
    canActivate: [permisoGuard],
    data: {
      path: 'gestion/seguimientos',
      permiso: 'canView'
    }
  },
  { 
    path: 'seguimientos/gestionar-seguimiento/:id', 
    component: SeguimientoGestionarComponent,
    canActivate: [permisoGuard],
    data: {
      path: 'gestion/seguimientos',
      permiso: 'canView'
    }
  },
  { 
    path: 'detalle_seguimiento/:idSeguimiento', 
    component: DetalleSeguimientosComponent,
    canActivate: [permisoGuard],
    data: {
      path: 'gestion/seguimientos',
      permiso: 'canView'
    }
   },
  { 
    path: 'consultar-alertas/:id', 
    component: ConsultarAlertasComponent,
    canActivate: [permisoGuard],
    data: {
      path: 'gestion/seguimientos',
      permiso: 'canView'
    }
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionRoutingModule {

}
