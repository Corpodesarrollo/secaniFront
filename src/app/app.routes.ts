import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { ContentComponent } from './components/content/content.component';
import { ContenthomeComponent } from './components/contenthome/contenthome.component';


export const routes: Routes = [

  { path: '', component: ContenthomeComponent },
  { path: 'home', component: ContenthomeComponent },
  { path: 'login', component: LoginComponent },

  {
    path: 'mi-semana',
    loadComponent: () =>
      import('./components/modules/usuarios/mi-semana/mi-semana.component').then((c) => c.MiSemanaComponent),
  },
  {
    path: 'usuarios',
    component: ContentComponent,
    loadChildren: () =>
      import('./components/modules/usuarios/usuarios.module').then(
        (m) => m.UsuariosModule
      )
  },
  {
    path: 'gestion',
    component: ContentComponent,
    loadChildren: () =>
      import('./components/modules/gestion/gestion.module').then(
        (m) => m.GestionModule
      )
  },
  {
    path: 'administracion',
    component: ContentComponent,
    loadChildren: () =>
      import('./components/modules/administracion/administracion.module').then(
        (m) => m.AdministracionModule
      )
  },
  {
    path: 'perfil',
    component: ContentComponent,
    loadChildren: () =>
      import('./components/modules/perfil/perfil.module').then(
        (m) => m.PerfilModule
      )
  },
  {
    path: 'gestion/mi_semana',
    loadComponent: () =>
      import('./components/modules/usuarios/mi-semana/mi-semana.component').then((c) => c.MiSemanaComponent),
  },
  {
    path: 'usuarios',
    component: ContentComponent,
    loadChildren: () =>
      import('./components/modules/usuarios/usuarios.module').then(
        (m) => m.UsuariosModule
      )
  },
  {
    path: 'gestion',
    component: ContentComponent,
    loadChildren: () =>
      import('./components/modules/gestion/gestion.module').then(
        (m) => m.GestionModule
      )
  },
  {
    path: 'administracion',
    component: ContentComponent,
    loadChildren: () =>
      import('./components/modules/administracion/administracion.module').then(
        (m) => m.AdministracionModule
      )
  },
  {
    path: 'intento',
    loadComponent: () =>
      import('./components/modules/usuarios/intento-seguimiento/intento/intento.component').then((c) => c.IntentoComponent),
  },
  {
    path: 'intento-exitoso',
    loadComponent: () =>
      import('./components/modules/usuarios/intento-seguimiento/intento-exitoso/intento-exitoso.component').then((c) => c.IntentoExitosoComponent),
  },
  {
    path: 'intento-seguimiento',
    loadComponent: () =>
      import('./components/modules/usuarios/intento-seguimiento/intento-seguimiento.component').then((c) => c.IntentoSeguimientoComponent),
  },
  {
    path: 'casos-entidad',
    loadComponent: () =>
      import('./components/modules/usuarios/casos-entidad/casos-entidad.component').then((c) => c.CasosEntidadComponent),
  },

  {
    path: 'dashboard-agente-seguimiento',
    loadComponent: () =>
      import('./components/modules/gestion/dashboard-agente-seguimiento/dashboard-agente-seguimiento.component').then((c) => c.DashboardAgenteSeguimientoComponent),
  },

  {
    path: 'dashboard-coordinador',
    loadComponent: () =>
      import('./components/modules/gestion/dashboard-coordinador/dashboard-coordinador.component').then((c) => c.DashboardCoordinadorComponent),
  },

  {
    path: 'dashboard-eapb',
    loadComponent: () =>
      import('./components/modules/gestion/dashboard-eapb/dashboard-eapb.component').then((c) => c.DashboardEapbComponent),
  },

/*
  {
    path: 'crear-contacto',
    loadComponent: () =>
      import('./components/modules/usuarios/nna-contacto/crear-nna-agregar-contacto/crear-nna-agregar-contacto.component').then((c) => c.CrearNnaAgregarContactoComponent),
  },
  */
];
