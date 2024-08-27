import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionRoutingModule } from './gestion-routing.module';
import { ConsultarSeguimientosComponent } from './consultar-seguimientos/consultar-seguimientos.component';
import { SeguimientoAdherenciaComponent } from './seguimientos/seguimiento-adherencia/seguimiento-adherencia.component';
import { SeguimientoDatosComponent } from './seguimientos/seguimiento-datos/seguimiento-datos.component';
import { SeguimientoDificultadesComponent } from './seguimientos/seguimiento-dificultades/seguimiento-dificultades.component';
import { SeguimientoEstadoComponent } from './seguimientos/seguimiento-estado/seguimiento-estado.component';
import { SeguimientoFallecidoComponent } from './seguimientos/seguimiento-fallecido/seguimiento-fallecido.component';
import { SeguimientoSinDiagnosticoComponent } from './seguimientos/seguimiento-sin-diagnostico/seguimiento-sin-diagnostico.component';
import { SeguimientoSinTratamientoComponent } from './seguimientos/seguimiento-sin-tratamiento/seguimiento-sin-tratamiento.component';
import { SeguimientoTrasladoComponent } from './seguimientos/seguimiento-traslado/seguimiento-traslado.component';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { BotonNotificacionComponent } from '../boton-notificacion/boton-notificacion.component';


@NgModule({
  declarations: [],
  imports: [
    TableModule, BadgeModule, CardModule, CommonModule, BotonNotificacionComponent,
    CommonModule,
    GestionRoutingModule,
    SeguimientoDatosComponent,
    SeguimientoEstadoComponent,
    SeguimientoTrasladoComponent,
    SeguimientoDificultadesComponent,
    SeguimientoAdherenciaComponent,
    SeguimientoSinDiagnosticoComponent,
    SeguimientoSinTratamientoComponent,
    SeguimientoFallecidoComponent
  ]
})
export class GestionModule { }
