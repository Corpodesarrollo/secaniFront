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

const routes: Routes = [
  { path: 'indicadores', component: IndicadoresComponent },
  { path: 'reporte-inconsistencia', component: ReporteInconsistenciaComponent },
  {
    path: 'depuracion_p115',
    children: [
      { path: '', component: ReporteDepuracionComponent },
      { path: ':id', component: ReporteDetalleNuevoDepuradosComponent },
      { path: '**', redirectTo: '' }
    ]
  },
  { path: 'alertas', component: ReporteDinamicoAlertasComponent },
  { path: 'nna', component: ReporteDinamicoNnaComponent },
  { path: 'seguimientos', component: ReporteDinamicoSeguimientoComponent },
  { path: 'reporte-dinamico-eapb', component: ReporteDinamicoEapbComponent },
  { path: 'llamadas', component: ReporteGeneralLlamadasComponent },
  { path: '**', redirectTo: 'reporte-inconsistencia' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
