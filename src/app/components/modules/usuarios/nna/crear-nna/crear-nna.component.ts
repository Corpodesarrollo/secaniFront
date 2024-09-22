import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngleUpIcon } from 'primeng/icons/angleup';
import { TpParametros } from '../../../../../core/services/tpParametros';
import { environment } from '../../../../../../environments/environment';
import { Generico } from '../../../../../core/services/generico';

@Component({
  selector: 'app-crear-nna',
  templateUrl: './crear-nna.component.html',
  styleUrls: ['../../general.component.css', './crear-nna.component.css'],
  encapsulation: ViewEncapsulation.Emulated // Esto es por defecto
})
export class CrearNnaComponent {
  visualizars!: any;
  first = 0;
  rows = 10;
  dataToParent: any;

  formNNA: FormGroup;
  maxDate: Date;

  //Listados select
  listadoTipoIdentificacion: any;
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
  //createdByUserId
  userId: any;
  ContactoNNAId: any;
  edad: string = "";
  listadoContacto: any = [];

  nnaFormCrearSinActivar: boolean = true;
  nnaFormCrearSinActivarDepartamento: boolean = true;

  //Dialog
  visibleDialogRolAgente: boolean = false;
  visibleDialogRolCoordinador: boolean = false;


  paiscolombia = 170;
  departamentoSeleccion: any;
  ciudadSeleccion: any;

  sexoId: any;
  rolIdGeneral = sessionStorage.getItem('roleId');

  constructor(private router: Router, private fb: FormBuilder, private tpParametros: TpParametros, private axios: Generico) {

    // Set the maximum date to today
    this.maxDate = new Date();

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

    //createdByUserId
    this.userId = sessionStorage.getItem('userId');
  }

  async ngOnInit() {
    this.listadoTipoIdentificacion = await this.tpParametros.getTPTipoIdentificacion();
    this.listadoRegimenAfiliacion = await this.tpParametros.getTPRegimenAfiliacion();
    this.listadoEAPB = await this.tpParametros.getTPEAPB();
    this.listadoEstadoIngresoEstrategia = await this.tpParametros.getTPEstadoIngresoEstrategia();
    this.listadoOrigenReporte = await this.tpParametros.getTPOrigenReporte();
    this.listadoPais = await this.tpParametros.getTPPais();
    this.listadoParentesco = await this.tpParametros.getTPParentesco();
    this.listadoEtnia = await this.tpParametros.getTPEtnia();
    this.listadoGrupoPoblacional = await this.tpParametros.getGrupoPoblacional();

    this.departamentoTs(this.paiscolombia);

    //Inicializando form
    this.nnaId = "";
    this.agenteId = "";
    this.coordinadorId = "";
    this.userId = sessionStorage.getItem('userId');

    if (this.rolIdGeneral == "14CDDEA5-FA06-4331-8359-036E101C5046") {//Agente de seguimiento
      this.agenteId = this.userId;
    }

    if (this.rolIdGeneral == "311882D4-EAD0-4B0B-9C5D-4A434D49D16D") {//Coordinador
      this.coordinadorId = this.userId;
    }

  }

  applySexo(sexo: string) {
    this.sexoId = sexo;
    this.formNNA.get('sexo')?.setValue(sexo);
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
    this.departamentoSeleccion = null;
    this.ciudadSeleccion = null;
    if (pais.target.value == 170) {//Colombia
      //console.log("pais", pais.target.value);
      this.listadoDepartamento = await this.tpParametros.getTPDepartamento(pais.target.value);
      this.nnaFormCrearSinActivarDepartamento = false;
      this.formNNA.get('departamentoNacimiento')?.setValidators([Validators.required]); // Eliminar validaciones
      this.formNNA.get('departamentoNacimiento')?.updateValueAndValidity();  // Actualizar el estado del control
      this.formNNA.get('ciudadNacimiento')?.setValidators([Validators.required]);  // Eliminar validaciones
      this.formNNA.get('ciudadNacimiento')?.updateValueAndValidity();  // Actualizar el estado del control
    } else {//Diferente a colombia
      this.listadoDepartamento = [];
      this.listadoCiudad = [];
      this.nnaFormCrearSinActivarDepartamento = true;
      this.formNNA.get('departamentoNacimiento')?.clearValidators();  // Eliminar validaciones
      this.formNNA.get('departamentoNacimiento')?.updateValueAndValidity();  // Actualizar el estado del control
      this.formNNA.get('ciudadNacimiento')?.clearValidators();  // Eliminar validaciones
      this.formNNA.get('ciudadNacimiento')?.updateValueAndValidity();  // Actualizar el estado del control
    }
  }

  async departamentoTs(pais: any) {
    if (pais == 170) {//Colombia
      //console.log("pais", pais.target.value);
      this.listadoDepartamento = await this.tpParametros.getTPDepartamento(pais);
      this.nnaFormCrearSinActivarDepartamento = false;
    } else {//Diferente a colombia
      this.nnaFormCrearSinActivarDepartamento = true;
    }
  }

  async ciudad(departamento: any) {
    this.listadoCiudad = await this.tpParametros.getTPCiudad(departamento.target.value);
  }

  btn_historial_nna() {
    //this.router.navigate(["/usuarios/historico_nna"]);
  }

  //Guardar formulario
  async onSubmit() {
    // Set default date and time
    const now = new Date();
    const defaultDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const defaultTime = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM

    this.formNNA.patchValue({
      fecha: defaultDate,
      hora: defaultTime
    });

    const cuidadorEncontrado = this.listadoContacto.find((cuidador: any) => cuidador.cuidadorCuidador === "1");
    var cuidadorJson = {
      "cuidadorNombres": "",
      "cuidadorParentescoId": 0,
      "cuidadorEmail": "",
      "cuidadorTelefono": ""
    };
    if (cuidadorEncontrado) {
      console.log('Cuidador encontrado:', cuidadorEncontrado);
      cuidadorJson = {
        "cuidadorNombres": cuidadorEncontrado.nombreCompletoCuidador,
        "cuidadorParentescoId": cuidadorEncontrado.parentescoCuidador,
        "cuidadorEmail": cuidadorEncontrado.correoElectronicoCuidador,
        "cuidadorTelefono": cuidadorEncontrado.numeroTelefonoCuidador
      };
    } else {
      console.log('No se encontró ningún cuidador con cuidadorCuidador = 1');
    }


    //Setear NNid
    var urlbase: string = environment.url_MsNna;
    var url_path = "NNA/Crear";
    var datosNna = {
      "id": 0,
      "estadoId": 15,
      "primerNombre": this.formNNA.get("primerNombre")?.value,
      "segundoNombre": this.formNNA.get("segundoNombre")?.value,
      "primerApellido": this.formNNA.get("primerApellido")?.value,
      "segundoApellido": this.formNNA.get("segundoApellido")?.value,
      "tipoIdentificacionId": this.formNNA.get('tipoId')?.value,
      "numeroIdentificacion": this.formNNA.get("numeroId")?.value,
      "fechaNacimiento": this.formNNA.get("fechaNacimiento")?.value,
      "municipioNacimientoId": this.formNNA.get("ciudadNacimiento")?.value,
      "sexoId": this.sexoId,
      "eapbId": this.formNNA.get("eapb0")?.value,
      "grupoPoblacionId": this.formNNA.get("grupoPoblacion")?.value,
      "etniaId": this.formNNA.get("etnia")?.value,
      "estadoIngresoEstrategiaId": this.formNNA.get('estadoIngresoEstrategia')?.value,
      "fechaIngresoEstrategia": this.formNNA.get('fechaIngresoEstrategia')?.value,
      "origenReporteId": this.formNNA.get('originReporte')?.value,
      "tipoRegimenSSId": this.formNNA.get("regimenAfiliacion")?.value,
      "departamentoTratamientoId": this.formNNA.get('departamentoNacimiento')?.value,
      "CreatedByUserId": this.userId || ' ',
      "dateCreated": now,
      "isDeleted": false,
      "paisId": "'"+this.formNNA.get("paisNacimiento")?.value+"'",
      "cuidadorNombres": cuidadorJson.cuidadorNombres,
      "cuidadorParentescoId": cuidadorJson.cuidadorParentescoId,
      "cuidadorEmail": cuidadorJson.cuidadorEmail,
      "cuidadorTelefono": cuidadorJson.cuidadorTelefono,
    };
    var nna = await this.axios.retorno_post(url_path, datosNna, true, urlbase);
    console.log("Crear Nna Guardar", nna, "form", this.formNNA.value, " this.listadoContacto ::", this.listadoContacto);

    this.nnaId = nna.datos[0].id;

    //Guardado de lista de contactos
    this.listadoContacto.forEach(async (cuidador: any) => {
      var contactoDatosNna = {
        "id": 0,
        "dateCreated": now,
        "createdByUserId": this.userId || ' ',
        "isDeleted": false,
        "nnaId": this.nnaId,
        "nombres": cuidador.nombreCompletoCuidador,
        "parentescoId": cuidador.parentescoCuidador,
        "email": cuidador.correoElectronicoCuidador,
        "telefonos": cuidador.numeroTelefonoCuidador,
        "telefnosInactivos": "",
        "cuidador": cuidador.cuidadorCuidador == 1 ? true : false
      };
      var urlbase: string = environment.url_MsNna;
      var url_path = "ContactoNNAs/Crear";
      var data = await this.axios.retorno_post(url_path, contactoDatosNna, true, urlbase);
      this.ContactoNNAId = data.datos[0].id;
    });



    //Genrar guardado
    if (this.rolIdGeneral == "14CDDEA5-FA06-4331-8359-036E101C5046") {//Agente de seguimiento
      this.visibleDialogRolAgente = false;
      this.visibleDialogRolAgente = true;
      this.agenteId = this.userId;
    }

    if (this.rolIdGeneral == "311882D4-EAD0-4B0B-9C5D-4A434D49D16D") {//Coordinador
      this.visibleDialogRolCoordinador = false;
      this.visibleDialogRolCoordinador = true;
      this.agenteId = null;
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
      this.nnaFormCrearSinActivarDepartamento = false;
    } else {
      // Handle the case where the response is empty
      this.nnaFormCrearSinActivar = true;
      this.nnaFormCrearSinActivarDepartamento = true;
    }
  }

  async handleDataContacto(data: any) {
    this.listadoContacto = data;
    console.log('Data received from child handleDataContacto:', 'Crear nna contacto', data, this.listadoContacto);
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
