import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngleUpIcon } from 'primeng/icons/angleup';
import { TpParametros } from '../../../../../core/services/tpParametros';
import { environment } from '../../../../../../environments/environment';
import { Generico } from '../../../../../core/services/generico';

@Component({
  selector: 'app-crear-nna-agregar-contacto',
  templateUrl: './crear-nna-agregar-contacto.component.html',
  styleUrls: ['../../general.component.css', './crear-nna-agregar-contacto.component.css'],
})
export class CrearNnaAgregarContactoComponent {
  @Input() nnaFormCrearSinActivar: any; // Recibir datos del padre
  @Output() dataToParent: any = new EventEmitter<any>(); // Emitir datos al padre

  visualizars!: any;
  first = 0;
  rows = 10;
  formNNA: FormGroup;
  listadoContacto: any[] = [];

  listadoParentesco: any;
  listadoCuidador: any;

  telefono: any;
  telefonosAcumulados: any[] = [];

  constructor(private router: Router, private fb: FormBuilder, private tpParametros: TpParametros, private axios: Generico) {
    this.formNNA = this.fb.group({
      nombreCompletoCuidador: ['', [Validators.required, Validators.maxLength(255)]],
      parentescoCuidador: ['', [Validators.required, Validators.maxLength(255)]],
      correoElectronicoCuidador: ['', [Validators.email, Validators.maxLength(255)]],
      numeroTelefonoCuidador: ['', [Validators.required, Validators.maxLength(30)]],
      cuidadorCuidador: ['', [Validators.required]],

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
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  // Método para verificar si un campo está vacío
  isEmpty(value: any): boolean {
    return value === null || value === undefined || value.trim() === '';
  }

  guardar() {
    //console.log("dialogo crear contacto guardar", this.formNNA.valid, this.formNNA.value);


    if (this.formNNA.valid) {

      this.agregarNuevoTelefonoContacto();
      // Convert the array to a string with '/' as the separator
      const telefonosString = this.convertirTelefonosLista();
      this.formNNA.patchValue({ 'numeroTelefonoCuidador': telefonosString });

      this.listadoContacto.push(this.formNNA.value);
      this.dataToParent.emit(this.listadoContacto); // Ensure this is an EventEmitter

      //console.log("guardar contacto", this.formNNA.value);

      this.cancelar();

      //limpiar lista telefonosAcumulados
      this.telefonosAcumulados = [];

    }
  }

  cancelar() {
    this.formNNA.reset();
  }

  editarContacto(listadoContacto: any) {
    //Cambiar de string a array
    this.telefonosAcumulados = listadoContacto.numeroTelefonoCuidador.split(' / ');
    listadoContacto.numeroTelefonoCuidador = this.telefonosAcumulados[this.telefonosAcumulados.length-1];
    this.eliminarTelefono(listadoContacto.numeroTelefonoCuidador);
    this.formNNA.patchValue({
      nombreCompletoCuidador: listadoContacto.nombreCompletoCuidador,
      correoElectronicoCuidador: listadoContacto.correoElectronicoCuidador,
      numeroTelefonoCuidador: listadoContacto.numeroTelefonoCuidador,
      cuidadorCuidador: listadoContacto.cuidadorCuidador,
      parentescoCuidador: listadoContacto.parentescoCuidador
    });

    // Find the index of the item to remove
    const index = this.listadoContacto.indexOf(listadoContacto);

    if (index !== -1) {
      // Remove the item from the array
      this.listadoContacto.splice(index, 1);
    }
  }

  agregarNuevoTelefonoContacto() {
    const telefono = this.formNNA.get('numeroTelefonoCuidador')?.value || '';

    if (telefono > 0 && telefono != null && telefono != "") {
      // Check if the phone number already exists in the array
      if (!this.telefonosAcumulados.includes(telefono)) {
        this.telefonosAcumulados.push(telefono);
        // Clear the form control value
        this.formNNA.patchValue({ 'numeroTelefonoCuidador': '' });
      }
    }
  }

  convertirTelefonosLista() {
    return this.telefonosAcumulados.join(' / ');
  }

  eliminarTelefono(telefono:any){
    // Find the index of the item to remove
    const index = this.telefonosAcumulados.indexOf(telefono);

    if (index !== -1) {
      // Remove the item from the array
      this.telefonosAcumulados.splice(index, 1);
    }
  }
}
