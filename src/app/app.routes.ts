import { Routes } from '@angular/router';

import { HealthComponent } from './components/health/health.component';
import { LayoutComponent } from './layout/layout.component';
import { LayoutSecondaryComponent } from './layout-secondary/layout-secondary.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'health', component: HealthComponent },
    ]
  }
];
