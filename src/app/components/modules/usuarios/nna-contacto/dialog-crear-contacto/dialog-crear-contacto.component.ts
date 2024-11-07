import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { GenericService } from '../../../../../services/generic.services';
import { Router } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { Generico } from '../../../../../core/services/generico';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TpParametros } from '../../../../../core/services/tpParametros';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { BrowserModule } from '@angular/platform-browser';
import { Parametricas } from '../../../../../models/parametricas.model';
import { TablasParametricas } from '../../../../../core/services/tablasParametricas';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ChipsModule } from 'primeng/chips';
import { ToastModule } from 'primeng/toast';
import { ContactoNNA } from '../../../../../models/contactoNNA.model';
import { apis } from '../../../../../models/apis.model';

@Component({
  selector: 'app-dialog-crear-contacto',
  standalone: true,
  imports: [DialogModule, CommonModule, ButtonModule,FormsModule,ReactiveFormsModule,DropdownModule,InputTextModule,ChipsModule,ToastModule],
  templateUrl: './dialog-crear-contacto.component.html',
  styleUrls: ['../../general.component.css', './dialog-crear-contacto.component.css'],
  providers: [MessageService]
})
export class DialogCrearContactoComponent {
  @Input() show: boolean = false;
  @Input() nnaId: number = 0; 
  @Input() contactoId: number = 0;
  @Output() closeModal = new EventEmitter<void>(); // Emite un evento al cerrar el modal
  @Output() dataToParent: any = new EventEmitter<any>(); // Emitir datos al padre

  contacto: ContactoNNA = {
    id: 0,
    nnaId: 0,
    nombreCompleto: '',
    parentesco: '',
    esCuidador: false,
    telefono: [],
    correo: '',
    estado: true
  }

  parentescos: Parametricas[] = [];
  selectedParentesco: Parametricas | undefined;
  isLoadingParentesco: boolean = true;

  esCuidador: boolean = false;
  estado: boolean = true;
  submitted: boolean = false;

  constructor(private service: GenericService, private tp: TablasParametricas, private messageService: MessageService) {
  
  }

  async ngOnInit() {
    this.parentescos = await this.tp.getTP('RLCPDParentesco');
    this.isLoadingParentesco = false;

    this.contacto.nnaId = this.nnaId;

    if (this.contactoId > 0) {
      this.cargarContacto();
    }
  }

  close() {
    this.closeModal.emit(); // Emite evento para cerrar el modal
  }

  cargarContacto() {
    this.service.get("ContactoNNAs/Obtener", `/${this.contactoId}`, apis.nna).subscribe({
      next: (response) => {
        this.contacto = response as ContactoNNA;
      },
      error: (error) => {
        console.error('Error al consumir el API:', error);
      }
    });
  }


  cancelar() {
    //this.formNNAContacto.reset();
  }

  // Método para verificar si un campo está vacío
  isEmpty(value: any): boolean {
    return value === null || value === undefined || value.trim() === '';
  }

  async guardar() {
    let data = {
      nnaId: this.contacto.nnaId,
      nombres: this.contacto.nombreCompleto,
      parentescoId: this.selectedParentesco?.codigo,
      email: this.contacto.correo,
      telefonos: this.contacto.telefono.join(','),
      telefnosInactivos: '',
      cuidador: this.contacto.esCuidador,
      id: this.contacto.id
    };

    this.submitted = true;

    if (this.validarCamposRequeridos()){
      this.service.post("ContactoNNAs/Crear", data, apis.nna).subscribe({
        next: (response) => {
          let result = response as { estado: boolean, descripcion: string };
          if (!result.estado) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: result.descripcion });
            return;
          }
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Contacto creado exitosamente.' });
          this.show = false;
        },
        error: (error) => {
          console.error('Error al consumir el API:', error);
        }
      });
    }
  }

  validarPhone(event: any): void {
    const phone = event.value;
    if (!this.formatPhone(phone)) {
      this.contacto.telefono = this.contacto.telefono.filter(e => e !== phone);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `${phone} no es un teléfono valido.` });
    }
  }

  formatPhone(value: string): boolean {
    const isValid = /^\d{10}$/.test(value);
    return isValid;
  }

  validarCamposRequeridos(): boolean {
    this.contacto.parentesco = this.selectedParentesco?.codigo ?? '';

    const camposAValidar = [
      this.contacto.nombreCompleto,
      this.contacto.parentesco,
      this.contacto.correo,
      this.contacto.telefono
    ];

    // Valida que cada campo no sea nulo, vacío o solo espacios en blanco
    for (const campo of camposAValidar) {
      if (!campo || campo.toString().trim() === '') {
        return false;
      }
    }

    return true;
  }

  isValidEmail(correo: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(correo);
  }

  async Actualizar() {
    //await this.nnaService.putNNA(this.nna);
  }
}
