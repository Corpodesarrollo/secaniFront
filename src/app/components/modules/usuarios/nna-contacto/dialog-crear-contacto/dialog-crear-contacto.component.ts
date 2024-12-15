import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
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
  @Input() contactoId: number = 0;
  @Input() nnaId: number = 0;
  @Output() closeModal = new EventEmitter<void>(); // Emite un evento al cerrar el modal
  @Output() dataToParent = new EventEmitter<any>();  // Emitir datos al padre

  telefonos:string[] = [];

  contacto: ContactoNNA = {
    id: 0,
    nnaId: 0,
    nombres: '',
    parentescoId: 0,
    parentesco: '',
    cuidador: false,
    telefonos: '',
    email: '',
    estado: true
  };

  parentescos: Parametricas[] = [];
  selectedParentesco: Parametricas | undefined;
  isLoadingParentesco: boolean = true;

  esCuidador: boolean = false;
  estado: boolean = true;
  submitted: boolean = false;

  constructor(private service: GenericService, private gs: GenericService, private tpp: TpParametros, private messageService: MessageService,private cdr: ChangeDetectorRef) {

  }

  async ngOnInit() {
    this.parentescos = await this.tpp.getParentescos();
    this.isLoadingParentesco = false;
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['show'] && changes['show'].currentValue) {
      console.log('contactoId', this.contactoId);
      if (this.contactoId > 0) {
        await this.cargarContacto();
      } 
    }

    if (changes['nnaId'] && changes['nnaId'].currentValue) {
      this.contacto.nnaId = this.nnaId;
    }
  }

  enviarContacto(){
    this.dataToParent.emit(this.contacto);
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Contacto cargado exitosamente.' });
    this.show = false;
  }


  close() {
    this.contacto = {
      id: 0,
      nnaId: this.nnaId,
      nombres: '',
      parentescoId: 0,
      parentesco: '',
      cuidador: false,
      telefonos: '',
      email: '',
      estado: true
    };
    this.telefonos = [];
    this.selectedParentesco = undefined;

    this.closeModal.emit(); // Emite evento para cerrar el modal
  }

  // Método para verificar si un campo está vacío
  isEmpty(value: any): boolean {
    return value === null || value === undefined || value.trim() === '';
  }

  async guardarContacto(){
    this.contacto.parentesco = this.selectedParentesco?.nombre ?? '';
    this.contacto.parentescoId = this.selectedParentesco?.id ?? 0;
    this.contacto.telefonos = this.telefonos.join(',');

    if(this.contacto.nnaId == 0){
      this.enviarContacto();
    }
    else{
      await this.guardar();
    }
  }

  async guardar() {
    let data = {
      nnaId: this.contacto.nnaId,
      nombres: this.contacto.nombres,
      parentescoId: this.selectedParentesco?.id,
      email: this.contacto.email,
      telefonos: this.telefonos.join(','),
      cuidador: this.contacto.cuidador,
      id: this.contacto.id
    };

    this.submitted = true;

    if (this.validarCamposRequeridos()){
      if (this.contactoId > 0) {
        this.service.put("ContactoNNAs", data, apis.nna).subscribe({
          next: (response) => {
            let result = response as { estado: boolean, descripcion: string };
            if (!result.estado) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: result.descripcion });
              return;
            }
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Contacto actualizado exitosamente.' });
            this.show = false;
          },
          error: (error) => {
            console.error('Error al consumir el API:', error);
          }
        });
      } else {
        this.service.post("ContactoNNAs", data, apis.nna).subscribe({
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
  }

  validarPhone(event: any): void {
    const phone = event.value;
    if (!this.formatPhone(phone)) {
      this.telefonos = this.telefonos.filter(e => e !== phone);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `${phone} no es un teléfono valido.` });
    }
  }

  formatPhone(value: string): boolean {
    const isValid = /^\d{10}$/.test(value);
    return isValid;
  }

  validarCamposRequeridos(): boolean {
    this.contacto.parentescoId = this.selectedParentesco?.id ?? 0;

    const camposAValidar = [
      this.contacto.nombres,
      this.contacto.parentescoId,
      this.telefonos
    ];

    // Valida que cada campo no sea nulo, vacío o solo espacios en blanco
    for (const campo of camposAValidar) {
      if (!campo || campo.toString().trim() === '') {
        return false;
      }
    }

    return true;
  }

  async cargarContacto() {
    try {
      const data: any = await this.gs.getAsync('ContactoNNAs/Obtener', `/${this.contactoId}`, apis.nna);
      let dataResult = data as { estado: boolean, descripcion: string, datos: ContactoNNA };
      this.contacto = dataResult.datos;
      this.telefonos = this.contacto.telefonos.split(',');
      this.selectedParentesco = this.parentescos.find(e => e.id == this.contacto.parentescoId);
    } catch (error) {
      console.error('Error fetching contact list', error);
    }
  }

  isValidEmail(correo: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(correo);
  }

  async Actualizar() {
    //await this.nnaService.putNNA(this.nna);
  }
}
