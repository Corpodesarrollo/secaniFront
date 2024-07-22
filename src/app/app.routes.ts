import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { ContentComponent } from './components/content/content.component';

export const routes: Routes = [

    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    {
        path: 'usuarios',
        component: ContentComponent,
        loadChildren: () =>
            import('./components/modules/usuarios/usuarios.module').then(
                (m) => m.UsuariosModule
            )
    }
];