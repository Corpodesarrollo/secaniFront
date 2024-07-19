import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { PermisosComponent } from './components/permisos/permisos.component';
import { ContentComponent } from './components/content/content.component';

export const routes: Routes = [
    
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'permisos', component: PermisosComponent },
    {
        path: 'usuarios',
        component: ContentComponent,
        loadChildren: () =>
            import('./components/modules/usuarios/usuarios.module').then(
                (m) => m.UsuariosModule
            )
    },
];
