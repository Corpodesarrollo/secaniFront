import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { MenuService } from './services/menu.service';
import { GenericService } from './services/generic.services';
import { environment } from '../environments/environment';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    // BUG-LZ 2026-06-20: PrimeNG dialogs cerrados sin limpiar dejan `p-overflow-hidden`
    // en <body> -> el scroll desaparece en todas las paginas hasta F5. Limpiamos en cada
    // NavigationEnd como red de seguridad global.
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        if (typeof document !== 'undefined') {
          document.body.style.overflow = '';
          document.body.classList.remove('p-overflow-hidden');
          document.documentElement.style.overflow = '';
        }
      });
  }
}



