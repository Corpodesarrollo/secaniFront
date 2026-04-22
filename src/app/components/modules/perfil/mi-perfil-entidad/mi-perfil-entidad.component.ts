import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../core/services/user';
import { GenericService } from '../../../../services/generic.services';

interface Contacto {
  id?: number;
  nombre: string;
  cargo: string;
  telefono: string;
  correo: string;
}

/**
 * HU RQ09-HU05 - Ver perfil Entidad Territorial / EAPB
 * Muestra datos principales + grilla de contactos editable
 */
@Component({
  selector: 'app-mi-perfil-entidad',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, ButtonModule, TooltipModule, DialogModule, InputTextModule, FormsModule],
  templateUrl: './mi-perfil-entidad.component.html',
  styleUrl: './mi-perfil-entidad.component.css'
})
export class MiPerfilEntidadComponent implements OnInit {
  xUser = new User();
  tipoEntidad = '';
  estadoActivo = true;
  tooltipEstado = 'Inactive su usuario únicamente en caso de cerrar legalmente la empresa o en caso de requerir ingresar al sistema con un usuario diferente al actual';

  contactoPrincipal = { nombre: '', cargo: '', correo: '' };
  contactos: Contacto[] = [];

  mostrarDialogo = false;
  modoEdicion = false;
  contactoForm: Contacto = this.nuevoContacto();

  constructor(private dataService: GenericService) {}

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

    this.contactoPrincipal = {
      nombre: this.xUser.name ?? '',
      cargo: 'Representante',
      correo: this.xUser.enterpriseEmail ?? this.xUser.email ?? ''
    };

    this.cargarContactos();
  }

  cargarContactos() {
    this.dataService.get_withoutParameters('ContactoEntidad', 'Authentication').subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.contactos = data.map((c: any) => ({
            id: c.id,
            nombre: c.nombre ?? c.nombres ?? '',
            cargo: c.cargo ?? '',
            telefono: c.telefono ?? c.telefonos ?? '',
            correo: c.correo ?? c.email ?? ''
          }));
        }
      },
      error: () => { this.contactos = []; }
    });
  }

  nuevoContacto(): Contacto {
    return { nombre: '', cargo: '', telefono: '', correo: '' };
  }

  abrirCrear() {
    this.modoEdicion = false;
    this.contactoForm = this.nuevoContacto();
    this.mostrarDialogo = true;
  }

  abrirEditar(c: Contacto) {
    this.modoEdicion = true;
    this.contactoForm = { ...c };
    this.mostrarDialogo = true;
  }

  guardar() {
    if (!this.contactoForm.nombre || !this.contactoForm.correo) {
      alert('Nombre y correo obligatorios');
      return;
    }
    if (this.modoEdicion && this.contactoForm.id) {
      const idx = this.contactos.findIndex(c => c.id === this.contactoForm.id);
      if (idx >= 0) this.contactos[idx] = { ...this.contactoForm };
    } else {
      this.contactos.push({ ...this.contactoForm, id: Date.now() });
    }
    this.mostrarDialogo = false;
  }

  cancelar() {
    this.mostrarDialogo = false;
  }
}
