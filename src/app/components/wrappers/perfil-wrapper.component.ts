import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../core/services/user';

/**
 * Wrapper Perfil - redirige según rol:
 * - Cuidador → /perfil/mi-perfil-cuidador (BUG-LZ-042, HU RQ08-HU06)
 * - EAPB/ET  → /perfil/mi-perfil-entidad  (HU RQ09-HU05)
 * - Otros    → /perfil/mi-perfil          (agente con horarios + ausencias)
 *
 * Historia BUG-LZ-036: antes el Cuidador caía en mi-perfil (Agente) y veía "Días laborales".
 * Se redirigió temporalmente a mi-perfil-entidad. BUG-LZ-042: QA confirma que el Cuidador
 * necesita pantalla dedicada (datos personales + celular editable + contactos adicionales),
 * NO la pantalla de EAPB/Entidad. Nueva ruta /perfil/mi-perfil-cuidador.
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
    if (user.isCuidador) {
      this.router.navigate(['/perfil/mi-perfil-cuidador']);
    } else if (user.isEAPB || user.isET) {
      this.router.navigate(['/perfil/mi-perfil-entidad']);
    } else {
      this.router.navigate(['/perfil/mi-perfil']);
    }
  }
}
