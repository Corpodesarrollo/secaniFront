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

  constructor(private messageService: MessageService) {}

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
    // TODO: persistir en backend cuando exista endpoint Cuidador profile
    this.messageService.add({ severity: 'success', summary: 'Datos adicionales guardados', life: 3000 });
  }
}
