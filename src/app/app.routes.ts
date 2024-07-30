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
    }
];
