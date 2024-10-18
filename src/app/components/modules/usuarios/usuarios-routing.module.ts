import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EAPBComponent } from './eapb/eapb.component';
import { HistoricoNnaComponent } from './nna/historico-nna/historico-nna.component';
import { CrearNnaComponent } from './nna/crear-nna/crear-nna.component';
import { DetalleNnaComponent } from './nna/detalle-nna/detalle-nna.component';

const routes: Routes = [
  { path: 'consultar_eapb', component:  EAPBComponent},
  { path: 'historico_nna', component: HistoricoNnaComponent },
  { path: 'crear_nna', component: CrearNnaComponent },
  { path: 'detalle_nna/:idNna', component: DetalleNnaComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
