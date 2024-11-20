import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReporteInconsistenciaComponent } from './reporte-inconsistencia/reporte-inconsistencia.component';
import { ReporteDepuracionComponent } from './reporte-depuracion/reporte-depuracion.component';
import { ReporteDetalleNuevoDepuradosComponent } from './reporte-detalle-nuevo-depurados/reporte-detalle-nuevo-depurados.component';
import { ReporteDinamicoAlertasComponent } from './reporte-dinamico-alertas/reporte-dinamico-alertas.component';
import { ReporteDinamicoNnaComponent } from './reporte-dinamico-nna/reporte-dinamico-nna.component';
import { ReporteDinamicoSeguimientoComponent } from './reporte-dinamico-seguimiento/reporte-dinamico-seguimiento.component';

const routes: Routes = [
  { path: 'reporte-inconsistencia', component: ReporteInconsistenciaComponent },
  {
    path: 'reporte-depuracion',
    children: [
      { path: '', component: ReporteDepuracionComponent },
      { path: ':id', component: ReporteDetalleNuevoDepuradosComponent },
      { path: '**', redirectTo: '' }
    ]
  },
  { path: 'reporte-dinamico-alertas', component: ReporteDinamicoAlertasComponent },
  { path: 'reporte-dinamico-nna', component: ReporteDinamicoNnaComponent },
  { path: 'reporte-dinamico-seguimiento', component: ReporteDinamicoSeguimientoComponent },
  { path: '**', redirectTo: 'reporte-inconsistencia' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
