import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { ContentComponent } from './components/content/content.component';
import { PermisosComponent } from './components/modules/administracion/permisos/permisos.component';


export const routes: Routes = [

    { path: '', component: ContentComponent },
    { path: 'home', component: ContentComponent },
    { path: 'login', component: LoginComponent },

    { path: 'mi-semana',
      loadComponent: () =>
        import('./components/modules/usuarios/mi-semana/mi-semana.component').then( (c) => c.MiSemanaComponent),
    },
    { path: 'permisos', component: PermisosComponent },
    {
        path: 'usuarios',
        component: ContentComponent,
        loadChildren: () =>
            import('./components/modules/usuarios/usuarios.module').then(
                (m) => m.UsuariosModule
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
    { path: 'intento',
      loadComponent: () =>
        import('./components/modules/usuarios/intento-seguimiento/intento/intento.component').then( (c) => c.IntentoComponent),
    },
    { path: 'intento-exitoso',
      loadComponent: () =>
        import('./components/modules/usuarios/intento-seguimiento/intento-exitoso/intento-exitoso.component').then( (c) => c.IntentoExitosoComponent),
    },
    { path: 'intento-seguimiento',
      loadComponent: () =>
        import('./components/modules/usuarios/intento-seguimiento/intento-seguimiento.component').then( (c) => c.IntentoSeguimientoComponent),
    },
    { path: 'casos-entidad',
      loadComponent: () =>
        import('./components/modules/usuarios/casos-entidad/casos-entidad.component').then( (c) => c.CasosEntidadComponent),
    },
];
