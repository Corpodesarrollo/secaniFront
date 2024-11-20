import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReporteInconsistenciaComponent } from './reporte-inconsistencia/reporte-inconsistencia.component';
import { ReporteDepuracionComponent } from './reporte-depuracion/reporte-depuracion.component';

const routes: Routes = [
  { path: 'reporte-inconsistencia', component: ReporteInconsistenciaComponent },
  {
    path: 'reporte-depuracion',
    children: [
      { path: '', component: ReporteDepuracionComponent },
      { path: '**', redirectTo: '' }
    ]
  },
  { path: '**', redirectTo: 'reporte-inconsistencia' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
