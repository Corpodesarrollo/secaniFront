import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { ContentComponent } from './components/content/content.component';

export const routes: Routes = [

    { path: '', component: ContentComponent },
    { path: 'home', component: ContentComponent },
    { path: 'login', component: LoginComponent },

    { path: 'mi-semana',
      loadComponent: () =>
        import('./components/modules/usuarios/mi-semana/mi-semana.component').then( (c) => c.MiSemanaComponent),
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
    }
];
