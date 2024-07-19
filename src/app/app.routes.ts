import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';


export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },

    { path: 'mi-semana',
      loadComponent: () =>
        import('./components/mi-semana/mi-semana.component').then( (c) => c.MiSemanaComponent),
    }
];
