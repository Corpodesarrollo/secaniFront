import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { GenericService } from '../../../../services/generic.services';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { Generico } from '../../../../core/services/generico';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TpParametros } from '../../../../core/services/tpParametros';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-dialog-crear-contacto',
  standalone: true,
  imports: [DialogModule, CommonModule, ButtonModule,FormsModule,ReactiveFormsModule], 
  templateUrl: './dialog-crear-contacto.component.html',
  styleUrls: ['../general.component.css', './dialog-crear-contacto.component.css'],
  encapsulation: ViewEncapsulation.Emulated // Esto es por defecto
})
export class DialogCrearContactoComponent {
  @Input() nnaId: any; // Recibir datos del padre
  @Output() dataToParent: any = new EventEmitter<any>(); // Emitir datos al padre

  visible: boolean = false;
  formNNAContacto: FormGroup;
  listadoParentesco: any;
  listadoCuidador: any;
  listadoEstado: any;



  constructor(private router: Router, private fb: FormBuilder, private tpParametros: TpParametros, private axios: Generico) {
    this.formNNAContacto = this.fb.group({
      nombreCompletoContacto: ['', [Validators.required, Validators.maxLength(100)]],
      parentescoContacto: ['', [Validators.required]],
      cuidadorContacto: ['', [Validators.required]],
      correoElectronicoContacto: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      numeroTelefonoContacto: ['', [Validators.required, Validators.maxLength(30)]],
      estadoContacto: ['', [Validators.required]]
    });
  }

  async ngOnInit() {
    this.listadoParentesco = await this.tpParametros.getTPParentesco();
    this.listadoCuidador = [
      {
        id: 1,
        name: "SI"
      },
      {
        id: 2,
        name: "NO"
      }
    ];
    this.listadoEstado = [
      {
        id: 1,
        name: "Activo"
      },
      {
        id: 2,
        name: "Inactivo"
      }
    ]

  }

  async showDialog() {
    this.visible = true;
  }
  cancelar() {
    this.formNNAContacto.reset();
    this.visible = false;
  }

  // Método para verificar si un campo está vacío
  isEmpty(value: any): boolean {
    return value === null || value === undefined || value.trim() === '';
  }

  guardar() {
    //console.log("dialogo crear contacto guardar", this.formNNAContacto.valid, this.formNNAContacto.value);
    if (this.formNNAContacto.valid) {
      this.dataToParent.emit(this.formNNAContacto.value); // Ensure this is an EventEmitter

      //console.log("guardar contacto", this.formNNAContacto.value);

      this.cancelar();
    }
  }
}
