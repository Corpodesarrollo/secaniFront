import { CommonModule } from '@angular/common';
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DragDropModule } from 'primeng/dragdrop';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { IntentoExitosoService } from './intento-exitoso.service';
import { Router } from '@angular/router';

import { UsuariosModule } from '../../usuarios.module';
import { TpParametros } from '../../../../../core/services/tpParametros';


@Component({
  selector: 'app-intento-exitoso',
  templateUrl: './intento-exitoso.component.html',
  styleUrls: ['./intento-exitoso.component.css'],
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule,
    CalendarModule , DragDropModule, CardModule, DialogModule, ButtonModule, DropdownModule, InputTextareaModule,UsuariosModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class IntentoExitosoComponent implements OnInit {

  seguimiento: any;
  ContactoNNA: any;
  id_usuario: any;
  NNA: any;

  fechaHoy: any;

  //TODO: cambiar a false
  opcion_1 = true;
  opcion_2 = false;
  opcion_3 = false;
  opcion_4 = false;

  displayModalContacto: boolean = false;

  //formularios

  formGroup2: FormGroup;
  formGroup3: FormGroup;
  formGroup4: FormGroup;

  parentesco: any;

  constructor(private fb: FormBuilder, public servicio: IntentoExitosoService, public router: Router, public TpParametros: TpParametros) {

    this.formGroup2 = this.fb.group({
      FechaIntento: [null, Validators.required],
    });

    this.formGroup3 = this.fb.group({
      FechaIntento: [null, Validators.required],
    });

    this.formGroup4 = this.fb.group({
      nombreRechazo: [null, Validators.required],
      parentescoRechazo: [null, Validators.required],
      razonesRechazo: [null, Validators.required],
    });
  }

  async ngOnInit() {
    this.fechaHoy = new Date();
    console.log('history.state ', history.state)

    this.seguimiento = history.state.seguimiento;
    this.ContactoNNA = history.state.ContactoNNA;

    //Obtenemos los datos simples del NNA
    this.NNA = await this.servicio.GetNNaById(this.ContactoNNA.nnaId);

    //TODO: OBTENER EL ID DEL USUARIO
    this.id_usuario = '73325';

    this.parentesco = await this.TpParametros.getTPParentesco();
  }

  operarOpcion2(){
    this.opcion_2 = true;

    this.opcion_1 = false;
    this.opcion_3 = false;
    this.opcion_4 = false;


  }

  operarOpcion3(){
    this.opcion_3 = true;

    this.opcion_1 = false;
    this.opcion_2 = false;
    this.opcion_4 = false;
  }

  operarOpcion4(){
    this.opcion_4 = true;

    this.opcion_1 = false;
    this.opcion_2 = false;
    this.opcion_3 = false;
  }

  cargarHoy(form: FormGroup){
    this.fechaHoy = new Date();
    let fechaHoy = this.fechaHoy;

    // Establece la hora actual en fechaHoy
    fechaHoy.setHours(fechaHoy.getHours(), fechaHoy.getMinutes(), fechaHoy.getSeconds(), fechaHoy.getMilliseconds());

    // Verifica que el formulario y el control existan
    if (form ) {
      // Establece la fecha y hora actuales en el control del formulario
      form.get('FechaIntento')!.patchValue(fechaHoy);

      // Imprime el valor del control para verificar
      console.log(form.get('FechaIntento')!.value);
    } else {
      console.error('El formulario o el control FechaIntento no existen.');
    }
  }

  cargarManana(form: FormGroup){
    const fechaMañana = new Date();
    fechaMañana.setDate(fechaMañana.getDate() + 1);
    // Establece la hora actual en fechaHoy
    fechaMañana.setHours(fechaMañana.getHours(), fechaMañana.getMinutes(), fechaMañana.getSeconds(), fechaMañana.getMilliseconds());

    // Verifica que el formulario y el control existan
    if (form ) {
      // Establece la fecha y hora actuales en el control del formulario
      form.get('FechaIntento')!.patchValue(fechaMañana);

      // Imprime el valor del control para verificar
      console.log(form.get('FechaIntento')!.value);
    } else {
      console.error('El formulario o el control FechaIntento no existen.');
    }
  }

  async guardarForm(form: FormGroup){


    if (form.valid) {
      console.log(form.value);

      //TODO: AJUSTAR PARA ENVIAR EL ID DEL USUARIO

      await this.guardarIntentoExitoso();

      //Procedemos a actualizar la fecha de seguimiento
      let data2 = {
        "Id": this.seguimiento.id,
        "FechaSeguimiento": this.formatDateTimeForSQLServer(form.get('FechaIntento')?.value)
      }

      await this.servicio.PutActualizarSeguimiento(data2);
      alert("Almacenamiento correcto");
      this.router.navigate(['intento-seguimiento'], { state: { id_seguimiento: this.seguimiento.id } });
    }
    else {
      alert("Debe Ingresar la fecha");
    }
  }

  async guardarIntentoExitoso(){
    let data = {
      ContactoNNAId: this.ContactoNNA.id,
      Email: this.ContactoNNA.email,
      Telefono: this.ContactoNNA.telefonos,
      TipoResultadoIntentoId: 2,
      //TipoFallaIntentoId: 0,
      CreatedByUserId: this.id_usuario
    }
    await this.servicio.PostIntento(data);
  }

  formatDateTimeForSQLServer(dateString: string): string {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses de 0 a 11
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }


  nuevoContacto(){
    this.displayModalContacto = true;
  }

  nnaFormCrearSinActivar = false;
  async handleDataContacto(data: any) {
    //this.listadoContacto = data;
    console.log('Data received from child handleDataContacto:', 'Crear nna contacto', data);
  }

  onModalHide(){

  }


  async iniciarSeguimiento(){
    await this.guardarIntentoExitoso();
    this.router.navigate(['/gestion/seguimientos/datos-seguimiento', this.ContactoNNA.nnaId]);
  }

  getNombreParentesco(parentescoId: string): string {

    const parentesco = this.parentesco.find((item: any) => item.codigo == parentescoId);
    return parentesco ? parentesco.nombre : '';
  }


  async guardarRechazo(){

    let form = this.formGroup4;
    if (form.valid) {
      console.log(form.value);

      //TODO: AJUSTAR PARA ENVIAR EL ID DEL USUARIO

      await this.guardarIntentoExitoso();

      //Procedemos a actualizar la fecha de seguimiento
      let data2 = {
        "Id": this.seguimiento.id,
        "NombreRechazo": form.get('nombreRechazo')?.value,
        "ParentescoRechazo": form.get('parentescoRechazo')?.value,
        "RazonesRechazo": form.get('razonesRechazo')?.value,
      }

      console.log("data2", data2)
      await this.servicio.PutActualizarSeguimientoRechazo(data2);
      alert("Almacenamiento correcto");
      this.router.navigate(['intento-seguimiento'], { state: { id_seguimiento: this.seguimiento.id } });
    }
    else {
      alert("Debe Ingresar la fecha");
    }
  }

}
