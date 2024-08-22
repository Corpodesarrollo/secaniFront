import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngleUpIcon } from 'primeng/icons/angleup';
import { TpParametros } from '../../../../core/services/tpParametros';
import { environment } from '../../../../../environments/environment';
import { Generico } from '../../../../core/services/generico';

@Component({
  selector: 'app-crear-nna',
  templateUrl: './crear-nna.component.html',
  styleUrls: ['../general.component.css', './crear-nna.component.css'],
  encapsulation: ViewEncapsulation.Emulated // Esto es por defecto
})
export class CrearNnaComponent {
  visualizars!: any;
  first = 0;
  rows = 10;
  dataToParent: any;

  formNNA: FormGroup;
  maxDate: string;

  //Listados select
  listadoTipoId: any;
  listadoRegimenAfiliacion: any;
  listadoEAPB: any;
  listadoEstadoIngresoEstrategia: any;
  listadoOrigenReporte: any;
  listadoPais: any;
  listadoDepartamento: any;
  listadoCiudad: any;
  listadoParentesco: any;
  listadoEtnia: any;
  listadoGrupoPoblacional: any;

  nnaId: any;
  agenteId: any;
  coordinadorId: any;
  userId: any;
  edad: string = "";
  listadoContacto: any = [];

  nnaFormCrearSinActivar: boolean = true;

  //Dialog
  visibleDialogRolAgente: boolean = false;
  visibleDialogRolCoordinador: boolean = false;
  

  


  constructor(private router: Router, private fb: FormBuilder, private tpParametros: TpParametros, private axios: Generico) {

    // Set the maximum date to today
    this.maxDate = new Date().toISOString().split('T')[0];

    this.formNNA = this.fb.group({
      tipoId: ['', [Validators.required]],
      numeroId: ['', [Validators.required, Validators.maxLength(20)]],
      primerNombre: ['', [Validators.required, Validators.maxLength(30)]],
      segundoNombre: ['', [Validators.maxLength(30)]],
      primerApellido: ['', [Validators.required, Validators.maxLength(30)]],
      segundoApellido: ['', [Validators.maxLength(30)]],

      fechaNacimiento: ['', [Validators.required]],

      paisNacimiento: ['', [Validators.required]],
      sexo: ['', [Validators.required]],
      departamentoNacimiento: ['', [Validators.required]],
      ciudadNacimiento: ['', [Validators.required]],
      etnia: ['', [Validators.required]],
      grupoPoblacion: ['', []],
      regimenAfiliacion: ['', [Validators.required]],
      eapb: ['', [Validators.required]],
      estadoIngresoEstrategia: ['', [Validators.required]],
      fechaIngresoEstrategia: ['', [Validators.required]],
      originReporte: ['', [Validators.required]],
      fecha: ['', []],
      hora: ['', []],
    });
  }

  async ngOnInit() {
    this.listadoTipoId = await this.tpParametros.getTpTipoId();
    this.listadoRegimenAfiliacion = await this.tpParametros.getTPRegimenAfiliacion();
    this.listadoEAPB = await this.tpParametros.getTPEAPB();
    this.listadoEstadoIngresoEstrategia = await this.tpParametros.getTPEstadoIngresoEstrategia();
    this.listadoOrigenReporte = await this.tpParametros.getTPOrigenReporte();
    this.listadoPais = await this.tpParametros.getTPPais();
    this.listadoParentesco = await this.tpParametros.getTPParentesco();
    this.listadoEtnia = await this.tpParametros.getTPEtnia();
    this.listadoGrupoPoblacional = await this.tpParametros.getGrupoPoblacional();

  }

  generarCalculoEdad() {
    this.edad = "";
    const dob = this.formNNA.get('fechaNacimiento')?.value;
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      const years = today.getFullYear() - birthDate.getFullYear();
      const months = today.getMonth() - birthDate.getMonth();
      const days = today.getDate() - birthDate.getDate();

      let ageString = `${years} años`;

      if (months < 0 || (months === 0 && days < 0)) {
        ageString = `${years - 1} años`;
      }

      const actualMonths = ((months + 12) % 12) + (days < 0 ? -1 : 0);
      const actualDays = (days + (days < 0 ? new Date(today.getFullYear(), today.getMonth(), 0).getDate() : 0)) % 30; // Simplified days

      if (actualMonths > 0) {
        ageString += `, ${actualMonths} meses`;
      }

      if (actualDays > 0) {
        ageString += ` y ${actualDays} días`;
      }

      this.edad = ageString;
    } else {
      this.edad = '';
    }
  }

  async departamento(pais: any) {
    //console.log("pais", pais.target.value);
    this.listadoDepartamento = await this.tpParametros.getTPDepartamento(pais.target.value);
  }

  async ciudad(departamento: any) {
    this.listadoCiudad = await this.tpParametros.getTPCiudad(departamento.target.value);
  }

  btn_historial_nna() {
    //this.router.navigate(["/usuarios/historico_nna"]);
  }

  onSubmit() {
    // Set default date and time
    const now = new Date();
    const defaultDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const defaultTime = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM

    this.formNNA.patchValue({
      fecha: defaultDate,
      hora: defaultTime
    });

    //Genrar guardado
    var rolId = sessionStorage.getItem('roleId');
    if (rolId == "14CDDEA5-FA06-4331-8359-036E101C5046") {//Agente de seguimiento
      this.visibleDialogRolAgente = true;
    }

    if (rolId == "311882D4-EAD0-4B0B-9C5D-4A434D49D16D") {//Coordinador
      this.visibleDialogRolAgente = true;
    }
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  // Método para verificar si un campo está vacío
  isEmpty(value: any): boolean {
    return value === null || value === undefined || value.trim() === '';
  }

  async handleDataValidarExistencia(data: any) {


    if (!data && Object.keys(data).length == 0) {
      //console.log('**** Data received from child:', 'handleDataValidarExistencia', data);
      this.nnaFormCrearSinActivar = false;
    } else {
      // Handle the case where the response is empty
      this.nnaFormCrearSinActivar = true;
    }
  }

  async handleDataContacto(data: any) {
    //console.log('Data received from child handleDataContacto:', 'Crear nna', data);
    this.listadoContacto.push(data);
  }

  cancelar() {
    this.formNNA.reset();
  }

  validarDisabledForm() {
    var r = (this.nnaFormCrearSinActivar == false && this.formNNA.valid && Object.keys(this.listadoContacto).length > 0) == true;
    //console.log('validarDisabledForm', this.nnaFormCrearSinActivar == false, this.formNNA.valid, Object.keys(this.listadoContacto).length > 0, r);
    return r;
  }


}
