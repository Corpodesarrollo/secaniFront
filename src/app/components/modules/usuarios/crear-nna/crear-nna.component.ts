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

  nnaId:any;
  listadoContacto:any;

  constructor(private router: Router, private fb: FormBuilder, private tpParametros: TpParametros, private axios: Generico) {
    this.formNNA = this.fb.group({
      tipoId: ['', [Validators.required]],
      numeroId: ['', [Validators.required, Validators.maxLength(20)]],
      primerNombre: ['', [Validators.required, Validators.maxLength(30)]],
      segundoNombre: ['', [Validators.maxLength(30)]],
      primerApellido: ['', [Validators.required, Validators.maxLength(30)]],
      segundoApellido: ['', [Validators.maxLength(30)]],
      edad: ['', [Validators.maxLength(3)]],
      fechaNacimiento: ['', [Validators.required]],
      paisNacimiento: ['', [Validators.required]],
      sexo: ['', [Validators.required]],
      departamentoNacimiento: ['', [Validators.required]],
      ciudadNacimiento: ['', [Validators.required]],
      etnia: ['', [Validators.required]],
      grupoPoblacion: ['', []],
      semanaGestacion: ['', []],
      validaExistencia: ['', [Validators.required]],
      regimenAfiliacion: ['', [Validators.required]],
      eapb: ['', [Validators.required]],
      estadoIngresoEstrategia: ['', [Validators.required]],
      fechaIngresoEstrategia: ['', [Validators.required]],
      originReporte: ['', [Validators.required]],
      agenteSeguimiento: ['', [Validators.required, Validators.maxLength(255)]],
      fecha: ['', [Validators.required]],
      hora: ['', []],

      nombreCompletoCuidador: ['', [Validators.required, Validators.maxLength(255)]],
      parentescoCuidador: ['', [Validators.required, Validators.maxLength(255)]],
      correoElectronicoCuidador: ['', [Validators.email, Validators.maxLength(255)]],
      numeroTelefonoCuidador: ['', [Validators.required, Validators.maxLength(30)]],

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
    if (this.formNNA.valid) {
      //console.log('Form Data:', this.formNNA.value);
    } else {
      //console.log('Form is invalid');
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
    console.log('Data received from child:', data);
  }

  async handleDataContacto(data: any) {
    console.log('Data received from child handleDataContacto:','Crear nna', data);
    this.listadoContacto = data;
  }
}
