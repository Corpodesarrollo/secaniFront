import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../core/services/user';

/**
 * Wrapper casos NNA Cáncer Infantil:
 * Redirige según prefijo enterpriseCode:
 * - [MU, DE, DI, DC] → /casos-entidad (EAPB, RQ07-HU02)
 * - [NI]             → /casos-territorio (ET,   RQ09-HU02)
 */
@Component({
  selector: 'app-casos-nna-wrapper',
  standalone: true,
  template: '<div style="padding:2rem;text-align:center">Cargando...</div>'
})
export class CasosNnaWrapperComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    const user = new User();
    const code = (user.enterpriseCode ?? '').toUpperCase().trim();
    const prefix = code.substring(0, 2);

    if (['MU', 'DE', 'DI', 'DC'].includes(prefix)) {
      this.router.navigate(['/casos-entidad']);
    } else if (prefix === 'NI') {
      this.router.navigate(['/casos-territorio']);
    } else {
      // Fallback - sin prefijo reconocido
      this.router.navigate(['/casos-entidad']);
    }
  }
}
