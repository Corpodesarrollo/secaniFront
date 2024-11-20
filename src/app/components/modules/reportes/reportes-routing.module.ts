import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReporteInconsistenciaComponent } from './reporte-inconsistencia/reporte-inconsistencia.component';

const routes: Routes = [
  { path: 'reporte-inconsistencia', component: ReporteInconsistenciaComponent },
    { path: '**', redirectTo: 'reporte-inconsistencia' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
