import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { IntentoService } from './intento.services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intento',
  templateUrl: './intento.component.html',
  styleUrls: ['./intento.component.css'],
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule,
    CardModule, DialogModule, ButtonModule, DropdownModule, InputTextareaModule]
})
export class IntentoComponent implements OnInit {
  @Output() recargaPadre: EventEmitter<void> = new EventEmitter<void>();
  @Output() resetState = new EventEmitter<void>();

  @Input() ContactoNNA: any = {};
  @Input() NNaCargado: any = {};

  @Input() seguimiento: any = {};


  verFormularioFallido = false;
  verFormularioExitoso = false;
  tiposFallas? : any;

  verMenu: any = true;

  //Formularios
  formFallido: FormGroup;

  totalSeguimientos:any;

  constructor( private fb: FormBuilder, public servicio: IntentoService,private router: Router,) {
    this.formFallido = this.fb.group({
      TipoFallaIntentoId: ['', Validators.required],
      ContactoNNAId: ['', Validators.required],
    });



  }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log("this.verMenu", this.verMenu);
  }

  async intentoFallido(){
    this.verMenu = false;
    this.verFormularioFallido = true;


   this.tiposFallas = await this.servicio.GetTipoFallasLlamada();
   this.totalSeguimientos = await this.servicio.GetSeguimientoNNA(this.seguimiento.nnaId);

    console.log(this.totalSeguimientos, this.seguimiento);
    /*this.tiposFallas = [
      {id_tipo_falla: 1, nombre_tipo_falla: 'Falla 1'},
      {id_tipo_falla: 2, nombre_tipo_falla: 'Falla 2'},
      {id_tipo_falla: 3, nombre_tipo_falla: 'Falla 3'},
    ];*/

  }

  intentoExitoso(){
    this.router.navigate(['intento-exitoso'], { state: { seguimiento: this.seguimiento, ContactoNNA: this.ContactoNNA } });
  }

  async guardarFallido(){
    //console.log(' this.ContactoNNA ', this.ContactoNNA)
    this.formFallido.get('ContactoNNAId')!.setValue(this.ContactoNNA.id);

    if (this.formFallido.valid) {
      console.log(this.ContactoNNA);

      //TODO: AJUSTAR PARA ENVIAR EL ID DEL USUARIO

      let data = {
        ContactoNNAId: this.ContactoNNA.id,
        Email: this.ContactoNNA.email,
        Telefono: this.ContactoNNA.telefonos,
        TipoResultadoIntentoId: 1,
        TipoFallaIntentoId: this.formFallido.value.TipoFallaIntentoId,
        CreatedByUserId: '73325'
      }

      console.log("data ",data);

      let respuesta = await this.servicio.PostIntento(data);

      if(respuesta == 1){
        this.recargaPadre.emit();
      }
      else {
        alert('Fallo en el guardar de intento fallido ');
      }

    } else {

      console.log('Formulario inválido', this.formFallido);
    }
  }

  regresar(){
    this.verMenu = true;
    this.verFormularioExitoso = false;
    this.verFormularioFallido = false;
  }


  resetFormState() {
    this.regresar();
  }

}
