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
import { AgentesSeguimientoComponent } from './agentes-seguimiento/agentes-seguimiento.component';
import { ModuloGuard } from '../../../services/modulo.guard';

const routes: Routes = [
  { 
    path: 'cuidadores', 
    component: CuidadoresComponent,
    canActivate: [ModuloGuard],
    data: {
      path: 'usuarios/cuidadores',
      permiso: 'canView'
    }
  },
  { 
    path: 'consultar_eapb', 
    component:  EAPBComponent,
    canActivate: [ModuloGuard],
    data: {
      path: 'usuarios/consultar_eapb',
      permiso: 'canView'
    }
  },
  { 
    path: 'externos_et', 
    component:  ContactoEntidadComponent,
    canActivate: [ModuloGuard],
    data: {
      path: 'usuarios/externos_et',
      permiso: 'canView'
    }
  },
  { 
    path: 'historico_nna', 
    component: HistoricoNnaComponent,
    canActivate: [ModuloGuard],
    data: {
      path: 'usuarios/historico_nna',
      permiso: 'canView'
    }
  },
  { 
    path: 'crear_nna', 
    component: CrearNnaComponent,
    canActivate: [ModuloGuard],
    data: {
      path: 'usuarios/crear_nna',
      permiso: 'canView'
    }
  },
  { 
    path: 'detalle_nna/:idNna', 
    component: DetalleNnaComponent,
    canActivate: [ModuloGuard],
    data: {
      path: 'usuarios/detalle_nna',
      permiso: 'canView'
    }
  },
  { 
    path: 'editar_nna/:idNna', 
    component: EditarNnaComponent,
    canActivate: [ModuloGuard],
    data: {
      path: 'usuarios/editar_nna',
      permiso: 'canEdit'
    }
  },
  { 
    path: 'casos-territorio', 
    component: CasosTerritorioComponent,
    canActivate: [ModuloGuard],
    data: {
      path: 'usuarios/casos-territorio',
      permiso: 'canView'
    }
  },
  {
    path: 'pendiente-reportar',
    component: PendienteReportarComponent,
    canActivate: [ModuloGuard],
    data: {
      path: 'usuarios/pendiente-reportar',
      permiso: 'canView'
    }
  },
  {
    path: 'agentes_seguimiento',
    component: AgentesSeguimientoComponent,
    canActivate: [ModuloGuard],
    data: {
      path: 'usuarios/agentes_seguimiento',
      permiso: 'canView'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
