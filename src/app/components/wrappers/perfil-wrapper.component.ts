import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../core/services/user';

/**
 * Wrapper Perfil - redirige según rol:
 * - EAPB/ET → /perfil/mi-perfil-entidad (HU RQ09-HU05)
 * - Otros   → /perfil/mi-perfil (agente)
 */
@Component({
  selector: 'app-perfil-wrapper',
  standalone: true,
  template: '<div style="padding:2rem;text-align:center">Cargando perfil...</div>'
})
export class PerfilWrapperComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    const user = new User();
    if (user.isEAPB || user.isET) {
      this.router.navigate(['/perfil/mi-perfil-entidad']);
    } else {
      this.router.navigate(['/perfil/mi-perfil']);
    }
  }
}
