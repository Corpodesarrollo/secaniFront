import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EAPBComponent } from './eapb/eapb.component';
import { HistoricoNnaComponent } from './nna/historico-nna/historico-nna.component';
import { CrearNnaComponent } from './nna/crear-nna/crear-nna.component';
import { DetalleNnaComponent } from './nna/detalle-nna/detalle-nna.component';
import { EditarNnaComponent } from './nna/editar-nna/editar-nna.component';
import { CasosTerritorioComponent } from './casos-territorio/casos-territorio.component';
import { PendienteReportarComponent } from './nna/pendiente-reportar/pendiente-reportar.component';
import { CuidadoresComponent } from './cuidadores/cuidadores.component';
import { ContactoEntidadComponent } from './contacto-entidad/contacto-entidad.component';

const routes: Routes = [
  { path: 'cuidadores', component: CuidadoresComponent },
  { path: 'consultar_eapb', component:  EAPBComponent},
  { path: 'externos_et', component:  ContactoEntidadComponent},
  { path: 'historico_nna', component: HistoricoNnaComponent },
  { path: 'crear_nna', component: CrearNnaComponent },
  { path: 'detalle_nna/:idNna', component: DetalleNnaComponent },
  { path: 'editar_nna/:idNna', component: EditarNnaComponent },
  { path: 'casos-territorio', component: CasosTerritorioComponent },
  { path: 'pendiente-reportar', component: PendienteReportarComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
