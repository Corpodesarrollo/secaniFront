import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { PermisosComponent } from './components/permisos/permisos.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'permisos', component: PermisosComponent }
];
