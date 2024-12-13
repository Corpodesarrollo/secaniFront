import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { BotonNotificacionComponent } from '../../../boton-notificacion/boton-notificacion.component';
import { Router, RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { GenericService } from '../../../../../services/generic.services';
import { TablasParametricas } from '../../../../../core/services/tablasParametricas';
import { TpParametros } from '../../../../../core/services/tpParametros';
import { User } from '../../../../../core/services/userService';
import { apis } from '../../../../../models/apis.model';
import { environment } from '../../../../../../environments/environment';
import { NNA } from '../../../../../models/nna.model';
import { forkJoin } from 'rxjs';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Parametricas } from '../../../../../models/parametricas.model';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SplitterModule } from 'primeng/splitter';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-pendiente-reportar',
  templateUrl: './pendiente-reportar.component.html',
  styleUrls: ['./pendiente-reportar.component.css'],
  standalone: true,
  imports: [TableModule, BadgeModule, CardModule, CommonModule, BotonNotificacionComponent, RouterModule, DialogModule, CalendarModule, DropdownModule, InputTextModule, SplitterModule, FormsModule],
  providers: [MessageService]
})
export class PendienteReportarComponent implements OnInit {

  verCasos: Boolean = true;
  verNuevoNNA: Boolean = false;

  estadoRegistrado: number = 15;
  estadoReportado: number = 16;
  estadoSolicitado: number = 17;

  public estadosNNA: any;
  public agenteAsignado: any;

  public filtroEstado: any = 0;
  public filtroAgente: any = "";
  public filtroBuscar: any = "";
  public filtroOrganizar: any = 1;

  activeFilter: string = '15';

  casos: {
    agenteAsignado: string;
    estado: string;
    estadoColorBG: string;
    estadoColorText: string;
    estadoDescripcion: string;
    estadoId: number;
    noCaso: number | null; // Puede ser número o nulo
    noDocumento: string;
    nombreNNA: string;
    ultimaActualizacion: string;
  }[] = [];

  casosDatosNNA: NNA[] = [];
  casosNNATabla: NNA[] = [];
  parentescos: Parametricas[] = [];
  diagnosticos: any[] = [];
  tipoDocumento: any[] = [];
  sexoAnn: any[] = [
    {"id" : 1, "nombre" : "Masculino"},
    {"id" : 2, "nombre" : "Femenino"}
  ];
  aseguradoras: any[] = [
    {"id" : 1, "nombre" : "Aseguradora1"},
    {"id" : 2, "nombre" : "Aseguradora2"}
  ];
  departamentos: any[] = [];
  municipios: any[] = [];

  tipoDocumentoSeleccionado: any ="";
  numeroDocumento: any = "";
  primerNombre: any = "";
  segundoNombre: any = "";
  primerApellido: any = "";
  segundoApellido: any = "";
  fechaNAcimiento: any = "";
  sexoSeleccionado: any;
  tieneDiagnostico: Boolean = false;
  aseguradoraSeleccionada: any;
  deptoSeleccionado: any = "";
  municipioSeleccionado: any = "";
  evidenciaDiagnostico: any = null;
  nombresApellidosCuidador: any = "";
  tipoDocumentoCuidador: any = "";
  numeroDocumentoCuidador: any = "";
  email: any = "";
  confirmarEmail: any = "";
  numeroCelular: any = "";
  evidenciaParentesco: any = null;
  autorizaLlamadas: Boolean = false;
  autorizaCorros: Boolean = false;
  archivoDiagnosticoSeleccionado: string | null = null;
  archivoParentescoSeleccionado: string | null = null;



  panelSeleccionadoNuevoNNA: number = 1;


  constructor(
    private router: Router,
    private genericService: GenericService,
    private tp: TablasParametricas,
    private tpParametro: TpParametros,
    private user: User,
    private messageService: MessageService
  ) { }

  async ngOnInit() {
    this.estadosNNA = await this.tpParametro.getTpEstadosNNA() ?? [];
    this.agenteAsignado = await this.tpParametro.getAgentesExistentesAsignados() ?? [];
    this.buscar();
    this.loadParentescos();
    this.loadDiagnosticos();
    this.loadTipoDocumentos();
    this.loadDepartamentos();
  }

  async buscar() {
    var url = environment.url_MsNna;
    var parameter: any = {
      estado: this.filtroEstado,
      agente: this.filtroAgente,
      buscar: this.filtroBuscar,
      orden: this.filtroOrganizar
    };
    this.genericService.post('NNA/ConsultarNNAFiltro', parameter, apis.nna).subscribe({
      next: (data: any) => {
        this.casos = data;
        this.procesarCasos();
      }
    });
  }

  async procesarCasos() {
    for (const caso of this.casos) {
      if (caso.noCaso) {
        try {
          this.genericService.get_withoutParameters(`NNA/${caso.noCaso}`, 'NNA').subscribe({
            next: async (nnaData: any) => {
              if (nnaData) {
                this.casosDatosNNA.push(nnaData);
                this.applyFilterEstado(this.estadoRegistrado);
              }
            },
            error: (err: any) => {
              console.error('Error al cargar datos del NNA', err)
            }
          });
        } catch (err) {
          //console.error(`Error al procesar el caso ${caso.noCaso}:`, err);
        }
      }
    }
    //this.applyFilterEstado(this.estadoRegistrado);
  }

  applyFilterEstado(filter: number) {
    this.filtroEstado = filter;
    this.casosNNATabla = this.casosDatosNNA.filter(nna => nna.estadoId === filter);
  }

  loadParentescos(){
    this.genericService.get_withoutParameters(`TablaParametrica/RLCPDParentesco`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.parentescos = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  loadDiagnosticos(){
    this.genericService.get_withoutParameters(`CIE10`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.diagnosticos = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  loadTipoDocumentos(){
    this.genericService.get_withoutParameters(`TablaParametrica/APSTipoIdentificacion`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.tipoDocumento = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  loadDepartamentos(){
    this.genericService.get_withoutParameters(`TablaParametrica/Departamento`, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.departamentos = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  loadMunicipios(){
    this.genericService.get_withoutParameters(`TablaParametrica/Municipios/`+this.deptoSeleccionado, 'TablaParametrica').subscribe({
      next: async (data: any) => {
        this.municipios = data;
      },
      error: (err: any) => console.error('Error al cargar datos del NNA', err)
    });
  }

  getNombreCompleto(primerNombre:any, segundoNombre:any, primerApellido:any, segundoApellido:any): string {
    const nombres = [primerNombre, segundoNombre, primerApellido, segundoApellido];
    return nombres.filter(nombre => nombre && nombre.trim() !== '').join(' ');
  }

  getNombreParentescoPorId(id: any): string | undefined {
    const resultado = this.parentescos.find(item => item.codigo === id.toString());
    return resultado ? resultado.nombre : 'No se encuentra el ID: ' + id;
  }

  getNombreDiagnosticoPorId(id: any): string | undefined {
    const resultado = this.diagnosticos.find(item => item.id === id);
    return resultado ? resultado.nombre : 'No se encuentra el ID: ' + id;
  }

  contarRegistrados(): number | undefined{
    const conteoEstadoRegistrados = this.casosDatosNNA.filter(nna => nna.estadoId === this.estadoRegistrado).length;
    return conteoEstadoRegistrados;
  }

  contarReportados(): number | undefined{
    const conteoEstadoRegistrados = this.casosDatosNNA.filter(nna => nna.estadoId === this.estadoReportado).length;
    return conteoEstadoRegistrados;
  }

  contarSolicitado(): number | undefined{
    const conteoEstadoRegistrados = this.casosDatosNNA.filter(nna => nna.estadoId === this.estadoSolicitado).length;
    return conteoEstadoRegistrados;
  }

  getBadgeTexto(estadoId: number): string {
    switch (estadoId) {
      case 15:
        return 'Registrado';
      case 16:
        return 'Reportado';
      case 17:
        return 'Solicitado';
      default:
        return 'Error';
    }
  }

  getBadgeColor(estadoId: number): string {
    switch (estadoId) {
      case 15:
        return 'bg-success';
      case 16:
        return 'bg-info';
      case 17:
        return 'bg-dark';
      default:
        return 'bg-secondary';
    }
  }

  nuevoNNA(){
    this.verCasos = false;
    this.verNuevoNNA = true;
  }

  cancelarNuevoNNA(){
    this.verCasos = true;
    this.verNuevoNNA = false;
  }

  seleccionarPanelNuevoNNA(numPanel:number){
    this.panelSeleccionadoNuevoNNA = numPanel;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input?.files?.length) {
      const file = input.files[0];

      if (file.type !== 'application/pdf') {
        alert('Por favor selecciona un archivo PDF.');
        this.archivoDiagnosticoSeleccionado = null;
        return;
      }

      const maxSizeInBytes = 8 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        alert('El archivo debe ser menor a 8 MB.');
        this.archivoDiagnosticoSeleccionado = null;
        return;
      }

      this.archivoDiagnosticoSeleccionado = file.name;
      this.evidenciaDiagnostico = file;
    }
  }

  onFileParentescoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input?.files?.length) {
      const file = input.files[0];

      if (file.type !== 'application/pdf') {
        alert('Por favor selecciona un archivo PDF.');
        this.archivoParentescoSeleccionado = null;
        return;
      }

      const maxSizeInBytes = 8 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        alert('El archivo debe ser menor a 8 MB.');
        this.archivoParentescoSeleccionado = null;
        return;
      }

      this.archivoParentescoSeleccionado = file.name;
      this.evidenciaParentesco = file;
    }
  }

  validarCampos(): boolean {
    // Validar Tipo de Documento
    if (!this.tipoDocumentoSeleccionado || this.tipoDocumentoSeleccionado === "") {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El tipo de documento de NNA es obligatorio.'
      });
      return false;
    }

    // Validar Número de Documento
    if (!this.numeroDocumento || this.numeroDocumento === "") {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El número de documento de NNA es obligatorio.'
      });
      return false;
    }

    if (!/^\d+$/.test(this.numeroDocumento)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El número de documento de NNA debe ser numérico.'
      });
      return false;
    }

    if (this.numeroDocumento.length > 20) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El número de documento de NNA debe tener un máximo de 20 caracteres.'
      });
      return false;
    }

    // Validar Segundo Nombre
    if (this.segundoNombre && this.segundoNombre.length > 50) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El segundo nombre de NNA debe tener un máximo de 50 caracteres.'
      });
      return false;
    }

    if (this.segundoNombre && !/^[a-zA-Z\s]+$/.test(this.segundoNombre)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El segundo nombre de NNA debe contener solo letras.'
      });
      return false;
    }

    // Validar Primer Apellido
    if (!this.primerApellido || this.primerApellido === "") {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El primer apellido de NNA es obligatorio.'
      });
      return false;
    }

    if (this.primerApellido.length > 50) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El primer apellido de NNA debe tener un máximo de 50 caracteres.'
      });
      return false;
    }

    if (!/^[a-zA-Z\s]+$/.test(this.primerApellido)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El primer apellido de NNA debe contener solo letras.'
      });
      return false;
    }

    // Validar Segundo Apellido
    if (this.segundoApellido && this.segundoApellido.length > 50) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El segundo apellido de NNA debe tener un máximo de 50 caracteres.'
      });
      return false;
    }

    if (this.segundoApellido && !/^[a-zA-Z\s]+$/.test(this.segundoApellido)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El segundo apellido de NNA debe contener solo letras.'
      });
      return false;
    }

    // Validar Fecha de Nacimiento
    if (!this.fechaNAcimiento || this.fechaNAcimiento === "") {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La fecha de nacimiento de NNA es obligatoria.'
      });
      return false;
    }

    // Validar Sexo Asignado al Nacer
    if (!this.sexoSeleccionado || this.sexoSeleccionado === "") {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El sexo asignado al nacer de NNA es obligatorio.'
      });
      return false;
    }

    // Validar ¿Tiene Diagnóstico?
    /*if (this.tieneDiagnostico !== "Sí" && this.tieneDiagnostico !== "No") {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe especificar si NNA tiene diagnóstico.'
      });
      return false;
    }*/

    // Validar Aseguradora
    if (!this.aseguradoraSeleccionada || this.aseguradoraSeleccionada === "") {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La aseguradora de NNA es obligatoria.'
      });
      return false;
    }

    // Validar Departamento de Procedencia
    if (!this.deptoSeleccionado || this.deptoSeleccionado === "") {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El departamento de procedencia de NNA es obligatorio.'
      });
      return false;
    }

    // Validar Municipio de Procedencia
    if (!this.municipioSeleccionado || this.municipioSeleccionado === "") {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El municipio de procedencia de NNA es obligatorio.'
      });
      return false;
    }

    // Validar Evidencia del Diagnóstico o Sospecha
    if (!this.evidenciaDiagnostico || this.evidenciaDiagnostico === "") {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La evidencia del diagnóstico o sospecha es obligatoria.'
      });
      return false;
    }

    // Validar Nombres y Apellidos
    if (!this.nombresApellidosCuidador || this.nombresApellidosCuidador === "") {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El campo "Nombres y apellidos" es obligatorio.'
      });
      return false;
    }

    if (this.nombresApellidosCuidador.length > 100) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El campo "Nombres y apellidos" debe tener un máximo de 100 caracteres.'
      });
      return false;
    }

    if (!/^[a-zA-Z\s]+$/.test(this.nombresApellidosCuidador)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El campo "Nombres y apellidos" debe contener solo letras.'
      });
      return false;
    }

    // Validar Tipo de Identificación
    if (!this.tipoDocumentoCuidador || this.tipoDocumentoCuidador === "") {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El campo "Tipo de identificación" es obligatorio.'
      });
      return false;
    }

    if (this.tipoDocumentoCuidador.length > 2) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El campo "Tipo de identificación" debe tener un máximo de 2 caracteres.'
      });
      return false;
    }

    if (!/^[a-zA-Z]+$/.test(this.tipoDocumentoCuidador)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El campo "Tipo de identificación" debe contener solo letras.'
      });
      return false;
    }

    // Validar Número de Identificación
    if (!this.numeroDocumentoCuidador || this.numeroDocumentoCuidador === "") {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El campo "Número de identificación" es obligatorio.'
      });
      return false;
    }

    if (this.numeroDocumentoCuidador.length > 20) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El campo "Número de identificación" debe tener un máximo de 20 caracteres.'
      });
      return false;
    }

    if (!/^\d+$/.test(this.numeroDocumentoCuidador)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El campo "Número de identificación" debe contener solo números.'
      });
      return false;
    }

    // Validar Email
    if (!this.email || this.email === "") {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El campo "Email" es obligatorio.'
      });
      return false;
    }

    if (this.email.length > 100) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El campo "Email" debe tener un máximo de 100 caracteres.'
      });
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(this.email)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El campo "Email" debe ser un email válido.'
      });
      return false;
    }

    // Validar Confirmar Email
    if (!this.confirmarEmail || this.confirmarEmail === "") {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El campo "Confirmar Email" es obligatorio.'
      });
      return false;
    }

    if (this.confirmarEmail !== this.email) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El campo "Confirmar Email" debe coincidir con el email ingresado.'
      });
      return false;
    }

    // Validar Número de Celular
    if (!this.numeroCelular || this.numeroCelular === "") {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El campo "Número de celular" es obligatorio.'
      });
      return false;
    }

    if (this.numeroCelular.length > 100) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El campo "Número de celular" debe tener un máximo de 100 caracteres.'
      });
      return false;
    }

    if (!/^\d+$/.test(this.numeroCelular)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El campo "Número de celular" debe contener solo números.'
      });
      return false;
    }

    // Validar Autorizaciones
    /*if (this.autorizaLlamadas !== true) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe autorizar recibir llamadas telefónicas.'
      });
      return false;
    }*/

    /*if (this.autorizaCorros !== true) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe autorizar recibir correos electrónicos.'
      });
      return false;
    }*/

    // Validar Evidencia de Parentesco
    if (!this.evidenciaParentesco || this.evidenciaParentesco === "") {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe adjuntar una evidencia de parentesco.'
      });
      return false;
    }

    return true; // Si todas las validaciones pasan, se retorna true
  }




  async guardarCambios(){

    if (!this.validarCampos()) {
      return;
    }

    console.log("Guardar datos")

  }

}
