import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReporteInconsistenciaComponent } from './reporte-inconsistencia/reporte-inconsistencia.component';
import { ReporteDepuracionComponent } from './reporte-depuracion/reporte-depuracion.component';
import { ReporteDetalleNuevoDepuradosComponent } from './reporte-detalle-nuevo-depurados/reporte-detalle-nuevo-depurados.component';
import { ReporteDinamicoAlertasComponent } from './reporte-dinamico-alertas/reporte-dinamico-alertas.component';
import { ReporteDinamicoNnaComponent } from './reporte-dinamico-nna/reporte-dinamico-nna.component';
import { ReporteDinamicoSeguimientoComponent } from './reporte-dinamico-seguimiento/reporte-dinamico-seguimiento.component';
import { ReporteDinamicoEapbComponent } from './reporte-dinamico-eapb/reporte-dinamico-eapb.component';
import { ReporteGeneralLlamadasComponent } from './reporte-general-llamadas/reporte-general-llamadas.component';
import { IndicadoresComponent } from './indicadores/indicadores.component';
import { ReporteDinamicoEntidadTerritorialComponent } from './reporte-dinamico-entidad-territorial/reporte-dinamico-entidad-territorial.component';
import { permisoGuard } from '../../../guards/permiso.guard';

const routes: Routes = [
  {
    path: 'indicadores',
    component: IndicadoresComponent,
    canActivate: [permisoGuard],
    data: {
      path: 'reportes/indicadores',
      permiso: 'canView'
    }
  },
  {
    path: 'depuracion_p115',
    children: [
      { path: '', component: ReporteDepuracionComponent },
      { path: ':id', component: ReporteDetalleNuevoDepuradosComponent },
      { path: '**', redirectTo: '' }
    ],
    canActivate: [permisoGuard],
    data: {
      path: 'reportes/depuracion_p115',
      permiso: 'canView'
    },
  },
  {
    path: 'alertas',
    component: ReporteDinamicoAlertasComponent,
    canActivate: [permisoGuard],
    data: {
      path: 'reportes/alertas',
      permiso: 'canView'
    },
  },
  {
    path: 'nna',
    component: ReporteDinamicoNnaComponent,
    canActivate: [permisoGuard],
    data: {
      path: 'reportes/nna',
      permiso: 'canView'
    },
  },
  {
    path: 'seguimientos',
    component: ReporteDinamicoSeguimientoComponent,
    canActivate: [permisoGuard],
    data: {
      path: 'reportes/seguimientos',
      permiso: 'canView'
    },
  },
  {
    path: 'eapb',
    component: ReporteDinamicoEapbComponent,
    canActivate: [permisoGuard],
    data: {
      path: 'reportes/eapb',
      permiso: 'canView'
    },
  },
  {
    path: 'llamadas',
    component: ReporteGeneralLlamadasComponent,
    canActivate: [permisoGuard],
    data: {
      path: 'reportes/llamadas',
      permiso: 'canView'
    },
  },
  {
    path: 'reporte-dinamico-entidad-territorial',
    component: ReporteDinamicoEntidadTerritorialComponent,
    canActivate: [permisoGuard],
    data: {
      path: 'reportes/reporte-dinamico-entidad-territorial',
      permiso: 'canView'
    },
  },
  {
    path: 'inconsistencias',
    component: ReporteInconsistenciaComponent,
    canActivate: [permisoGuard],
    data: {
      path: 'reportes/inconsistencias',
      permiso: 'canView'
    },
  },
  { path: '**', redirectTo: 'indicadores' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
