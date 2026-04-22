import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { User } from '../../../../core/services/user';

/**
 * Perfil para roles EAPB y ET (HU RQ09-HU05)
 * Muestra datos de entidad del usuario autenticado
 */
@Component({
  selector: 'app-mi-perfil-entidad',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './mi-perfil-entidad.component.html',
  styleUrl: './mi-perfil-entidad.component.css'
})
export class MiPerfilEntidadComponent implements OnInit {
  xUser = new User();
  tipoEntidad: string = '';

  ngOnInit() {
    const code = (this.xUser.enterpriseCode ?? '').toUpperCase().trim();
    const prefix = code.substring(0, 2);
    switch (prefix) {
      case 'MU': this.tipoEntidad = 'Municipio'; break;
      case 'DE': this.tipoEntidad = 'Departamento'; break;
      case 'DI': this.tipoEntidad = 'Distrito'; break;
      case 'DC': this.tipoEntidad = 'Distrito Capital'; break;
      case 'NI': this.tipoEntidad = 'Entidad Territorial Nacional'; break;
      default: this.tipoEntidad = 'EAPB / Entidad';
    }
  }
}
