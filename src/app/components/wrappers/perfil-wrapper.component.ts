import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../core/services/user';

/**
 * Wrapper Perfil - redirige según rol:
 * - EAPB/ET/Cuidador → /perfil/mi-perfil-entidad (HU RQ09-HU05, BUG-LZ-036 Cuidador)
 * - Otros            → /perfil/mi-perfil (agente con horarios + ausencias)
 *
 * BUG-LZ-036: antes el Cuidador caía en mi-perfil (Agente) y veía "Días laborales y horario de trabajo".
 * La pantalla mi-perfil-entidad muestra el set de datos esperado para Cuidador (nombre, ID, correo,
 * celular editable, contactos adicionales) sin las secciones de horario/ausencia.
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
    if (user.isEAPB || user.isET || user.isCuidador) {
      this.router.navigate(['/perfil/mi-perfil-entidad']);
    } else {
      this.router.navigate(['/perfil/mi-perfil']);
    }
  }
}
