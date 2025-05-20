import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { ContentComponent } from './components/content/content.component';
import { ContenthomeComponent } from './components/contenthome/contenthome.component';
import { AlertasGestionarComponent } from './components/modules/alertas/alertas-gestionar/alertas-gestionar.component';
import { EstadoSeguimientoComponent } from './components/modules/gestion/estado-seguimiento/estado-seguimiento.component';
import { HealthComponent } from './components/health/health.component';
import { LayoutComponent } from './layout/layout.component';
import { LayoutSecondaryComponent } from './layout-secondary/layout-secondary.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: ContenthomeComponent },
      { path: 'administracion', component: ContentComponent, loadChildren: () => import('./components/modules/administracion/administracion.module').then((m) => m.AdministracionModule) },
      { path: 'casos-entidad', loadComponent: () => import('./components/modules/usuarios/casos-entidad/casos-entidad.component').then((c) => c.CasosEntidadComponent) },
      { path: 'cuidador', loadChildren: () => import('./components/modules/cuidador/cuidador.module').then((m) => m.CuidadorModule) },
      { path: 'dashboard-agente-seguimiento', loadComponent: () => import('./components/modules/gestion/dashboard-agente-seguimiento/dashboard-agente-seguimiento.component').then((c) => c.DashboardAgenteSeguimientoComponent) },
      { path: 'dashboard-coordinador', loadComponent: () => import('./components/modules/gestion/dashboard-coordinador/dashboard-coordinador.component').then((c) => c.DashboardCoordinadorComponent) },
      { path: 'dashboard-eapb', loadComponent: () => import('./components/modules/gestion/dashboard-eapb/dashboard-eapb.component').then((c) => c.DashboardEapbComponent) },
      { path: 'estado-seguimiento', component: EstadoSeguimientoComponent },
      { path: 'gestion', component: ContentComponent, loadChildren: () => import('./components/modules/gestion/gestion.module').then((m) => m.GestionModule) },
      { path: 'gestion/mi_semana', loadComponent: () => import('./components/modules/usuarios/mi-semana/mi-semana.component').then((c) => c.MiSemanaComponent) },
      { path: 'gestionar-alertas', component: AlertasGestionarComponent },
      { path: 'health', component: HealthComponent },
      { path: 'home', component: ContenthomeComponent },
      { path: 'intento', loadComponent: () => import('./components/modules/usuarios/intento-seguimiento/intento/intento.component').then((c) => c.IntentoComponent) },
      { path: 'intento-exitoso', loadComponent: () => import('./components/modules/usuarios/intento-seguimiento/intento-exitoso/intento-exitoso.component').then((c) => c.IntentoExitosoComponent) },
      { path: 'intento-seguimiento', loadComponent: () => import('./components/modules/usuarios/intento-seguimiento/intento-seguimiento.component').then((c) => c.IntentoSeguimientoComponent) },
      { path: 'login', component: LoginComponent },
      { path: 'mis-seguimientos', component: EstadoSeguimientoComponent },
      { path: 'mi-semana', loadComponent: () => import('./components/modules/usuarios/mi-semana/mi-semana.component').then((c) => c.MiSemanaComponent) },
      { path: 'perfil', component: ContentComponent, loadChildren: () => import('./components/modules/perfil/perfil.module').then((m) => m.PerfilModule) },
      { path: 'reportes', loadChildren: () => import('./components/modules/reportes/reportes.module').then((m) => m.ReportesModule) },
      { path: 'usuarios', component: ContentComponent, loadChildren: () => import('./components/modules/usuarios/usuarios.module').then((m) => m.UsuariosModule) },
      { path: 'prueba', loadComponent: () => import('./components/modules/gestion/consultar-alertas/consultar-alertas.component').then((m) => m.ConsultarAlertasComponent) },
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
