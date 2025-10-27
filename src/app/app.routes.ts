import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { ContentComponent } from './components/content/content.component';
import { ContenthomeComponent } from './components/contenthome/contenthome.component';
import { AlertasGestionarComponent } from './components/modules/alertas/alertas-gestionar/alertas-gestionar.component';
import { EstadoSeguimientoComponent } from './components/modules/gestion/estado-seguimiento/estado-seguimiento.component';
import { HealthComponent } from './components/health/health.component';
import { LayoutComponent } from './layout/layout.component';
import { LayoutSecondaryComponent } from './layout-secondary/layout-secondary.component';
import { ModuloGuard } from './services/Modulo.Guard';


export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [     
      { path: '', component: ContenthomeComponent, canActivate: [ModuloGuard] },
      { path: 'administracion', component: ContentComponent, loadChildren: () => import('./components/modules/administracion/administracion.module').then((m) => m.AdministracionModule), canActivate: [ModuloGuard] },
      { path: 'casos-entidad', loadComponent: () => import('./components/modules/usuarios/casos-entidad/casos-entidad.component').then((c) => c.CasosEntidadComponent), canActivate: [ModuloGuard] },
      { path: 'cuidador', loadChildren: () => import('./components/modules/cuidador/cuidador.module').then((m) => m.CuidadorModule), canActivate: [ModuloGuard] },
      { path: 'dashboard-agente-seguimiento', loadComponent: () => import('./components/modules/gestion/dashboard-agente-seguimiento/dashboard-agente-seguimiento.component').then((c) => c.DashboardAgenteSeguimientoComponent), canActivate: [ModuloGuard] },
      { path: 'dashboard-coordinador', loadComponent: () => import('./components/modules/gestion/dashboard-coordinador/dashboard-coordinador.component').then((c) => c.DashboardCoordinadorComponent), canActivate: [ModuloGuard] },
      { path: 'dashboard-eapb', loadComponent: () => import('./components/modules/gestion/dashboard-eapb/dashboard-eapb.component').then((c) => c.DashboardEapbComponent), canActivate: [ModuloGuard] },
      { path: 'estado-seguimiento', component: EstadoSeguimientoComponent, canActivate: [ModuloGuard] },
      { path: 'gestion', component: ContentComponent, loadChildren: () => import('./components/modules/gestion/gestion.module').then((m) => m.GestionModule), canActivate: [ModuloGuard] },
      { path: 'gestion/mi_semana', loadComponent: () => import('./components/modules/usuarios/mi-semana/mi-semana.component').then((c) => c.MiSemanaComponent), canActivate: [ModuloGuard] },
      { path: 'gestionar-alertas', component: AlertasGestionarComponent, canActivate: [ModuloGuard] },
      { path: 'health', component: HealthComponent, canActivate: [ModuloGuard] },
      { path: 'home', component: ContenthomeComponent, canActivate: [ModuloGuard] },
      { path: 'intento', loadComponent: () => import('./components/modules/usuarios/intento-seguimiento/intento/intento.component').then((c) => c.IntentoComponent), canActivate: [ModuloGuard] },
      { path: 'intento-exitoso', loadComponent: () => import('./components/modules/usuarios/intento-seguimiento/intento-exitoso/intento-exitoso.component').then((c) => c.IntentoExitosoComponent), canActivate: [ModuloGuard] },
      { path: 'intento-seguimiento', loadComponent: () => import('./components/modules/usuarios/intento-seguimiento/intento-seguimiento.component').then((c) => c.IntentoSeguimientoComponent), canActivate: [ModuloGuard] },
      { path: 'login', component: LoginComponent, canActivate: [ModuloGuard] },
      { path: 'seguimientos', component: EstadoSeguimientoComponent, canActivate: [ModuloGuard] },
      { path: 'mi-semana', loadComponent: () => import('./components/modules/usuarios/mi-semana/mi-semana.component').then((c) => c.MiSemanaComponent), canActivate: [ModuloGuard] },
      { path: 'perfil', component: ContentComponent, loadChildren: () => import('./components/modules/perfil/perfil.module').then((m) => m.PerfilModule), canActivate: [ModuloGuard] },
      { path: 'reportes', loadChildren: () => import('./components/modules/reportes/reportes.module').then((m) => m.ReportesModule), canActivate: [ModuloGuard] },
      { path: 'usuarios', component: ContentComponent, loadChildren: () => import('./components/modules/usuarios/usuarios.module').then((m) => m.UsuariosModule), canActivate: [ModuloGuard] },
      { path: 'prueba', loadComponent: () => import('./components/modules/gestion/consultar-alertas/consultar-alertas.component').then((m) => m.ConsultarAlertasComponent), canActivate: [ModuloGuard] },
    ]
  },
  {
    path: '',
    component: LayoutSecondaryComponent,
    children: [
      { path: 'respuesta-notificacion/:id', loadComponent: () => import('./components/modules/notificacion-respuesta/notificacion-respuesta.component').then((c) => c.NotificacionRespuestaComponent) }
    ]
  }
];