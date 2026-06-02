import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { User } from '../../../../core/services/user';
import { GenericService } from '../../../../services/generic.services';
import { apis } from '../../../../models/apis.model';

interface TelefonoExtra { id: number; numero: string; descripcion: string; }
interface CorreoExtra { id: number; correo: string; }

/**
 * BUG-LZ-042 - HU RQ08-HU06 Actualizar datos de contacto (Cuidador)
 * Pantalla dedicada al Cuidador (no reusa mi-perfil-entidad que es para EAPB/ET).
 *
 * Izquierda (lectura, excepto celular):
 *   - Nombre, Tipo ID, Numero ID, Correo
 *   - Numero celular editable + Guardar
 *   - Estado
 *
 * Derecha (datos contacto adicionales, editables):
 *   - N telefonos con descripcion
 *   - N correos electronicos
 */
@Component({
  selector: 'app-mi-perfil-cuidador',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, ButtonModule, InputTextModule, TableModule, TooltipModule, ToastModule],
  templateUrl: './mi-perfil-cuidador.component.html',
  styleUrl: './mi-perfil-cuidador.component.css',
  providers: [MessageService]
})
export class MiPerfilCuidadorComponent implements OnInit {
  xUser = new User();

  tipoIdentificacion = '';
  numeroIdentificacion = '';
  celular = '';
  celularEditando = false;
  celularOriginal = '';

  estadoActivo = true;
  tooltipEstado = 'Inactive su usuario únicamente en caso de requerir ingresar al sistema con un usuario diferente al actual';

  telefonos: TelefonoExtra[] = [];
  correos: CorreoExtra[] = [];

  constructor(private messageService: MessageService, private repos: GenericService) {}

  ngOnInit() {
    const alias = (this.xUser.alias ?? '').trim();
    const match = alias.match(/^([A-Z]{2})(\d+)$/i);
    if (match) {
      this.tipoIdentificacion = match[1].toUpperCase();
      this.numeroIdentificacion = match[2];
    } else {
      this.tipoIdentificacion = '';
      this.numeroIdentificacion = this.xUser.enterpriseIdentification ?? alias;
    }
    this.celular = '';
    this.celularOriginal = this.celular;

    this.cargarAdicionales();
  }

  // BUG-LZ-089: leer los contactos adicionales guardados (antes el componente no consultaba
  // backend al entrar; al guardar aparecia "exitoso" pero la pantalla quedaba vacia al volver).
  private cargarAdicionales() {
    if (!this.xUser.id) {
      return;
    }
    this.repos.get('ContactoCuidador/ContactosAdicionales/', this.xUser.id, apis.nna).subscribe({
      next: (data: any) => {
        this.telefonos = (data?.telefonos ?? []).map((t: any, i: number) => ({
          id: Date.now() + i,
          numero: t.numero ?? '',
          descripcion: t.descripcion ?? ''
        }));
        this.correos = (data?.correos ?? []).map((c: any, i: number) => ({
          id: Date.now() + 1000 + i,
          correo: c.correo ?? ''
        }));
      },
      error: (err: any) => console.error('No se pudieron cargar contactos adicionales del cuidador', err)
    });
  }

  editarCelular() {
    this.celularOriginal = this.celular;
    this.celularEditando = true;
  }

  cancelarCelular() {
    this.celular = this.celularOriginal;
    this.celularEditando = false;
  }

  guardarCelular() {
    if (!this.celular || !/^[0-9]{7,10}$/.test(this.celular)) {
      this.messageService.add({ severity: 'warn', summary: 'Celular invalido', detail: 'Ingrese un numero de 7 a 10 digitos.', life: 5000 });
      return;
    }
    // TODO: persistir en backend cuando exista endpoint Cuidador profile
    this.celularEditando = false;
    this.messageService.add({ severity: 'success', summary: 'Celular actualizado', life: 3000 });
  }

  agregarTelefono() {
    this.telefonos.push({ id: Date.now(), numero: '', descripcion: '' });
  }

  eliminarTelefono(id: number) {
    this.telefonos = this.telefonos.filter(t => t.id !== id);
  }

  agregarCorreo() {
    this.correos.push({ id: Date.now(), correo: '' });
  }

  eliminarCorreo(id: number) {
    this.correos = this.correos.filter(c => c.id !== id);
  }

  guardarAdicionales() {
    const telVacios = this.telefonos.some(t => !t.numero || !/^[0-9]{7,10}$/.test(t.numero));
    const corVacios = this.correos.some(c => !c.correo || !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(c.correo));
    if (telVacios || corVacios) {
      this.messageService.add({ severity: 'warn', summary: 'Campo requerido', detail: 'Complete telefonos (7-10 digitos) y correos validos.', life: 5000 });
      return;
    }
    if (!this.xUser.id) {
      this.messageService.add({ severity: 'error', summary: 'Sesion invalida', detail: 'No se pudo identificar al usuario.', life: 5000 });
      return;
    }

    // BUG-LZ-089: persistir en ContactoCuidador/ContactosAdicionales/Guardar.
    const payload = {
      userId: this.xUser.id,
      telefonos: this.telefonos.map(t => ({ numero: t.numero, descripcion: t.descripcion })),
      correos: this.correos.map(c => ({ correo: c.correo }))
    };
    this.repos.post('ContactoCuidador/ContactosAdicionales/Guardar', payload, apis.nna).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Datos adicionales guardados', life: 3000 });
      },
      error: (err: any) => {
        const detalle = (typeof err?.error === 'string' ? err.error : null) || err?.error?.message || err?.message || 'Error al guardar.';
        this.messageService.add({ severity: 'error', summary: 'No se pudo guardar', detail: detalle, life: 5000 });
      }
    });
  }
}
