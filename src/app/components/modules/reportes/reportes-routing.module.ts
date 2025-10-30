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
import { ModuloGuard } from '../../../services/modulo.guard';

const routes: Routes = [
  {
    path: 'indicadores',
    component: IndicadoresComponent,
    canActivate: [ModuloGuard],
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
    canActivate: [ModuloGuard],
    data: {
      path: 'reportes/depuracion_p115',
      permiso: 'canView'
    },
  },
  {
    path: 'alertas',
    component: ReporteDinamicoAlertasComponent,
    canActivate: [ModuloGuard],
    data: {
      path: 'reportes/alertas',
      permiso: 'canView'
    },
  },
  {
    path: 'nna',
    component: ReporteDinamicoNnaComponent,
    canActivate: [ModuloGuard],
    data: {
      path: 'reportes/nna',
      permiso: 'canView'
    },
  },
  {
    path: 'seguimientos',
    component: ReporteDinamicoSeguimientoComponent,
    canActivate: [ModuloGuard],
    data: {
      path: 'reportes/seguimientos',
      permiso: 'canView'
    },
  },
  {
    path: 'eapb',
    component: ReporteDinamicoEapbComponent,
    canActivate: [ModuloGuard],
    data: {
      path: 'reportes/eapb',
      permiso: 'canView'
    },
  },
  {
    path: 'llamadas',
    component: ReporteGeneralLlamadasComponent,
    canActivate: [ModuloGuard],
    data: {
      path: 'reportes/llamadas',
      permiso: 'canView'
    },
  },
  {
    path: 'reporte-dinamico-entidad-territorial',
    component: ReporteDinamicoEntidadTerritorialComponent,
    canActivate: [ModuloGuard],
    data: {
      path: 'reportes/reporte-dinamico-entidad-territorial',
      permiso: 'canView'
    },
  },
  {
    path: 'inconsistencias',
    component: ReporteInconsistenciaComponent,
    canActivate: [ModuloGuard],
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
