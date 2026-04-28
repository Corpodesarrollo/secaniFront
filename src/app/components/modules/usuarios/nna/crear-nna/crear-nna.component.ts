import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AngleUpIcon } from 'primeng/icons/angleup';
import { TpParametros } from '../../../../../core/services/tpParametros';
import { environment } from '../../../../../../environments/environment';
import { Generico } from '../../../../../core/services/generico';
import { ContactoNNA } from '../../../../../models/contactoNNA.model';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { BotonNotificacionComponent } from "../../../boton-notificacion/boton-notificacion.component";
import { DialogValidarExistenciaComponent } from "./dialog/dialog-validar-existencia/dialog-validar-existencia.component";
import { DialogCrearNnaMsgRolAgenteComponent } from "./dialog/dialog-crear-nna-msg-rol-agente/dialog-crear-nna-msg-rol-agente.component";
import { DialogCrearNnaMsgRolCoordinadorComponent } from "./dialog/dialog-crear-nna-msg-rol-coordinador/dialog-crear-nna-msg-rol-coordinador.component";
import { NnaContactoListaComponent } from "../../nna-contacto/nna-contacto-lista/nna-contacto-lista.component";
import { CalendarModule } from 'primeng/calendar';
import { Parametricas } from '../../../../../models/parametricas.model';
import { NNA } from '../../../../../models/nna.model';
import { DropdownModule } from 'primeng/dropdown';
import { TablasParametricas } from '../../../../../core/services/tablasParametricas';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { NNAService } from '../../../../../core/services/nnaService';
import { Persona } from '../../../../../models/persona.model';
import { PersonaService } from '../../../../../core/services/personaService';
import { User } from '../../../../../core/services/user';

@Component({
  selector: 'app-crear-nna',
  standalone: true,
  templateUrl: './crear-nna.component.html',
  imports: [
    BreadcrumbModule,
    CommonModule,
    BotonNotificacionComponent,
    FormsModule,
    ReactiveFormsModule,
    DialogValidarExistenciaComponent,
    CalendarModule,
    InputTextModule,
    DialogModule,
    DialogCrearNnaMsgRolAgenteComponent,
    DialogCrearNnaMsgRolCoordinadorComponent,
    NnaContactoListaComponent,
    DropdownModule,
  ],
  styleUrls: ['./crear-nna.component.css'],
  encapsulation: ViewEncapsulation.Emulated, // Esto es por defecto
})
export class CrearNnaComponent {

  nna: NNA = new NNA();

  maxDate: Date = new Date();

  items: MenuItem[] = [];
  submitted: boolean = false;
  submitted2: boolean = false;
  buscando: boolean = false;

  selectedTipoID: Parametricas | undefined;
  selectedPaisNacimiento: Parametricas | undefined;
  selectedEtnia: Parametricas | undefined;
  selectedGrupoPoblacional: Parametricas | undefined;
  selectedRegimenAfiliacion: Parametricas | undefined;
  selectedEAPB: Parametricas | undefined;
  selectedParentesco: Parametricas | undefined;
  selectedOrigenReporte: Parametricas | undefined;
  selectedDepartamento: Parametricas | undefined;
  selectedMunicipio: Parametricas | undefined;
  selectedEstadoIngresoEstrategia: Parametricas | undefined;

  isLoadingTipoID: boolean = true;
  isLoadingPaisNacimiento: boolean = true;
  isLoadingEtnia: boolean = true;
  isLoadingGrupoPoblacional: boolean = true;
  isLoadingRegimenAfiliacion: boolean = true;
  isLoadingEAPB: boolean = true;
  isLoadingParentesco: boolean = true;
  isLoadingOrigenReporte: boolean = true;
  isLoadingDepartamento: boolean = true;
  isLoadingMunicipio: boolean = false;
  isLoadingEstadosIngresoEstrategia: boolean = true;

  tipoID: Parametricas[] = [];
  paisNacimiento: Parametricas[] = [];
  etnias: Parametricas[] = [];
  gruposPoblacionales: Parametricas[] = [];
  regimenAfiliacion: Parametricas[] = [];
  EAPB: Parametricas[] = [];
  parentescos: Parametricas[] = [];
  origenReporte: Parametricas[] = [];
  departamentos: Parametricas[] = [];
  municipios: Parametricas[] = [];
  estadosIngresoEstrategia: Parametricas[] = [];

  nnaId: any;
  agenteId: any;
  coordinadorId: any;
  //createdByUserId
  userId: any;
  ContactoNNAId: any;
  edad: string = '';
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
  // BUG-027: leer rol/userId desde User (localStorage), antes leia sessionStorage que esta vacio con qa-login
  private userSession = new User();
  rolIdGeneral: string | null = this.userSession.idRol ?? null;

  listaContactos: ContactoNNA[] = [];

  visible: boolean = false;
  visible2: boolean = false;
  isPersona: boolean = false;
  saving: boolean = false;

  msg: string = '';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private tpParametros: TpParametros,
    private axios: Generico,
    private tp: TablasParametricas,
    private nnaService: NNAService,
    private personaService: PersonaService,
  ) {
    //createdByUserId
    this.userId = this.userSession.id ?? null;
  }

  async ngOnInit() {
    this.items = [
      { label: 'Histórico NNA', routerLink: '/usuarios/historico_nna' },
      { label: `Crear NNA` },
    ];

    this.tipoID = await this.tp.getTP('APSTipoIdentificacion');
    this.selectedTipoID = this.tipoID.find(
      (x) => x.codigo == this.nna.tipoIdentificacionId,
    );
    this.isLoadingTipoID = false;

    this.origenReporte = await this.tpParametros.getTPOrigenReporte();
    console.log('origenReporte', this.origenReporte);
    if(this.origenReporte == null){
      this.origenReporte = [];
    }
    this.selectedOrigenReporte = this.origenReporte.find(
      (x) => x.id == this.nna.origenReporteId,
    );
    this.isLoadingOrigenReporte = false;

    this.paisNacimiento = await this.tp.getTP('Pais');
    this.selectedPaisNacimiento = this.paisNacimiento.find(
      (x) => x.codigo == '170',
    );
    this.isLoadingPaisNacimiento = false;

    this.etnias = await this.tp.getTP('GrupoEtnico');
    this.selectedEtnia = this.etnias.find((x) => x.codigo == this.nna.etniaId);
    this.isLoadingEtnia = false;

    this.gruposPoblacionales = await this.tp.getTP('LCETipoPoblacionEspecial');
    this.selectedGrupoPoblacional = this.gruposPoblacionales.find(
      (x) => x.codigo == this.nna.grupoPoblacionId,
    );
    this.isLoadingGrupoPoblacional = false;

    this.regimenAfiliacion = await this.tp.getTP('APSRegimenAfiliacion');
    this.selectedRegimenAfiliacion = this.regimenAfiliacion.find(
      (x) => x.codigo == this.nna.tipoRegimenSSId,
    );
    this.isLoadingRegimenAfiliacion = false;

    this.EAPB = await this.tpParametros.getTPEAPB();
    if(this.EAPB == null){
      this.EAPB = [];
    }
    this.selectedEAPB = this.EAPB.find((x) => x.id == this.nna.eapbId);
    this.isLoadingEAPB = false;

    this.estadosIngresoEstrategia = await this.tpParametros.getEstadosIngresoEstrategia();
    if(this.estadosIngresoEstrategia == null){
      this.estadosIngresoEstrategia = [];
    }
    this.selectedEstadoIngresoEstrategia = this.estadosIngresoEstrategia.find(x => x.id == this.nna.estadoIngresoEstrategiaId);
    this.isLoadingEstadosIngresoEstrategia = false;

    this.departamentos = await this.tp.getTP('Departamento');
    this.selectedDepartamento = this.departamentos.find(
      (x) => x.codigo == this.nna.residenciaOrigenCategoriaId,
    );
    this.isLoadingDepartamento = false;

    //Inicializando form
    this.nna.edad = '';
    this.userId = this.userSession.id ?? null;

    if (this.rolIdGeneral == '14CDDEA5-FA06-4331-8359-036E101C5046') {
      //Agente de seguimiento
      this.agenteId = this.userId;
    }

    if (this.rolIdGeneral == '311882D4-EAD0-4B0B-9C5D-4A434D49D16D') {
      //Coordinador
      this.coordinadorId = this.userId;
    }
  }

  obtenerLista(lista: ContactoNNA[]) {
    this.listaContactos = lista; // Guardar la lista emitida por el hijo
    console.log('Lista de alertas recibidas:', this.listaContactos);
  }

  applySexo(sexo: string) {
    this.sexoId = sexo;
    this.nna.sexoId = this.sexoId;
  }

  // BUG-025: helper para validar mayoria de edad desde fecha string del endpoint Persona
  private esMayorDeEdad(fechaNacimientoStr: any): boolean {
    if (!fechaNacimientoStr) return false;
    const fechaStr = fechaNacimientoStr.toString().substring(0, 10);
    const [y, m, d] = fechaStr.split('-').map(Number);
    if (!y || !m || !d) return false;
    const nacimiento = new Date(y, m - 1, d);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mesActual = hoy.getMonth();
    const diaActual = hoy.getDate();
    if (mesActual < (m - 1) || (mesActual === (m - 1) && diaActual < d)) edad--;
    return edad >= 18;
  }

  CalcularEdad() {
    if (this.nna.fechaNacimiento) {
      const nacimiento = new Date(this.nna.fechaNacimiento);
      const hoy = new Date();

      let años = hoy.getFullYear() - nacimiento.getFullYear();
      let meses = hoy.getMonth() - nacimiento.getMonth();
      let días = hoy.getDate() - nacimiento.getDate();

      if (días < 0) {
        meses--;
        días += new Date(hoy.getFullYear(), hoy.getMonth(), 0).getDate();
      }

      if (meses < 0) {
        años--;
        meses += 12;
      }

      this.nna.edad = `${años} años, ${meses} meses, ${días} días`;
    }
  }

  async validarExistencia() {
    const baseUrl = environment.url_MsNna;
    this.submitted2 = true;
    this.buscando = true;
    this.nna.tipoIdentificacionId = this.selectedTipoID?.codigo ?? '';
    if (this.nna.numeroIdentificacion && this.nna.tipoIdentificacionId) {
      const url = `NNA/ConsultarNNAsByTipoIdNumeroId/${this.nna.tipoIdentificacionId}/${this.nna.numeroIdentificacion}`;
      try {
        const response: any = await this.axios.retorno_get(url, baseUrl);
        if (response && Object.keys(response).length > 0) {
          this.nna.id = response.id;
          this.visible = true;
        } else {
          let persona = await this.personaService.get(this.nna.tipoIdentificacionId, this.nna.numeroIdentificacion);
          if (persona) {
            // BUG-025: rechazar fallecidos y mayores de edad antes de habilitar formulario
            if (persona.esFallecido === true) {
              this.visible2 = true;
              this.isPersona = false;
              this.nnaFormCrearSinActivar = true;
              this.msg = 'No es posible crear el NNA: la persona figura como fallecida en la consulta de identidad.';
              this.buscando = false;
              return;
            }
            if (this.esMayorDeEdad(persona.fecha_nacimiento)) {
              this.visible2 = true;
              this.isPersona = false;
              this.nnaFormCrearSinActivar = true;
              this.msg = 'No es posible crear el NNA: la persona es mayor de edad (≥ 18 años).';
              this.buscando = false;
              return;
            }

            this.nna.primerNombre = persona.primer_nombre;
            this.nna.segundoNombre = persona.segundo_nombre;
            this.nna.primerApellido = persona.primer_apellido;
            this.nna.segundoApellido = persona.segundo_apellido;
            // BUG-010: parsear solo componente fecha (YYYY-MM-DD) como Date local
            // para evitar corrimiento por timezone (UTC -> local restaba un día)
            if (persona.fecha_nacimiento) {
              const fechaStr = persona.fecha_nacimiento.toString().substring(0, 10);
              const [y, m, d] = fechaStr.split('-').map(Number);
              this.nna.fechaNacimiento = new Date(y, m - 1, d);
            }
            this.CalcularEdad();
            if (persona.sexo == 'F') {
              this.applySexo('M');
            } else {
              this.applySexo('H');
            }

            this.isPersona = true;
          }
          else{
            // BUG-LZ-005: si Maestro Personas no encuentra el documento, mantener form bloqueado (no permitir crear personas no validadas)
            console.log('Response is empty or invalid');
            this.nnaFormCrearSinActivar = true;
            this.visible2 = true;
            this.isPersona = false;
            this.msg = 'No se encontró información de la persona con el número de identificación proporcionado. No es posible crear el NNA sin validación contra Maestro de Personas.';
          }
        }
      } catch (error) {
        console.error('Error validating existence:', error);
      }
    }
    this.buscando = false;
  }

  cancelarExistencia() {
    this.nnaFormCrearSinActivar = true;
    this.nna.numeroIdentificacion = '';
    this.nna.tipoIdentificacionId = '';
    this.selectedTipoID = undefined;
    this.nna = new NNA();
    this.nna.edad = '';
    this.listaContactos = [];
    this.submitted2 = false;
    this.isPersona = false;
  }

  async ciudad(departamento: any) {
    this.isLoadingMunicipio = true;
    this.municipios = [];
    if (this.selectedDepartamento) {
      this.nna.departamentoNacimientoId = this.selectedDepartamento.codigo ?? '';
      this.municipios = await this.tpParametros.getTPCiudad(
        this.selectedDepartamento.codigo,
      );
    } else {
      this.nna.departamentoNacimientoId = '';
    }
    const prev = this.selectedMunicipio?.codigo ?? this.nna.municipioNacimientoId;
    this.selectedMunicipio = prev
      ? this.municipios.find((x) => x.codigo == prev)
      : undefined;
    if (!this.selectedMunicipio) this.nna.municipioNacimientoId = '';
    this.isLoadingMunicipio = false;
  }

  //Guardar formulario
  async onSubmit() {
    this.submitted = true;
    if (this.validarCamposRequeridos() && !this.saving) {
      this.saving = true;
      // BUG-028: enviar createdByUserId para que backend cree Seguimiento + UsuarioAsignados al agente correcto
      this.nna.createdByUserId = this.userId ?? '';
      let result = await this.nnaService.postNNA(this.nna);
      console.log('Resultado de guardar el NNA:', result);
      if (result.estado) {
        this.nnaId = result.datos.id;
        if (this.rolIdGeneral == '14CDDEA5-FA06-4331-8359-036E101C5046') {
          //Agente de seguimiento
          this.visibleDialogRolAgente = false;
          this.visibleDialogRolAgente = true;
          this.agenteId = this.userId;
        }

        if (this.rolIdGeneral == '311882D4-EAD0-4B0B-9C5D-4A434D49D16D') {
          //Coordinador
          this.visibleDialogRolCoordinador = false;
          this.visibleDialogRolCoordinador = true;
          this.agenteId = null;
        }
      } else {
        this.msg = result.descripcion;
        this.visible2 = true;
        console.log('Error al guardar el NNA:', result.descripcion);
      }
    }
    else {
      this.msg = this.campoFaltante
        ? `Campo requerido: ${this.campoFaltante}`
        : 'Por favor, complete todos los campos requeridos.';
      this.visible2 = true;
      console.log('Error en la validación de los campos');
    }
    this.saving = false;
  }

  campoFaltante: string = '';

  validarCamposRequeridos(): boolean {
    this.nna.cuidadorParentescoId = this.selectedParentesco?.id ?? 0;
    this.nna.tipoIdentificacionId = this.selectedTipoID?.codigo ?? '';
    this.nna.paisId = this.selectedPaisNacimiento?.codigo ?? '';
    this.nna.etniaId = this.selectedEtnia?.codigo ?? '';
    this.nna.grupoPoblacionId = this.selectedGrupoPoblacional?.codigo ?? '';
    this.nna.tipoRegimenSSId = this.selectedRegimenAfiliacion?.codigo ?? '';
    this.nna.eapbId = this.selectedEAPB?.id ?? 0;
    this.nna.origenReporteId = this.selectedOrigenReporte?.id ?? 0;
    this.nna.departamentoNacimientoId = this.selectedDepartamento?.codigo ?? '';
    this.nna.municipioNacimientoId = this.selectedMunicipio?.codigo ?? '';
    this.nna.estadoIngresoEstrategiaId = this.selectedEstadoIngresoEstrategia?.id ?? 0;
    this.nna.contactos = this.listaContactos;

    const esColombia = this.nna.paisId == '170';

    const camposBase: { nombre: string, valor: any }[] = [
      { nombre: 'Origen del reporte', valor: this.nna.origenReporteId },
      { nombre: 'Primer nombre', valor: this.nna.primerNombre },
      { nombre: 'Primer apellido', valor: this.nna.primerApellido },
      { nombre: 'Tipo de identificación', valor: this.nna.tipoIdentificacionId },
      { nombre: 'Número de identificación', valor: this.nna.numeroIdentificacion },
      { nombre: 'Fecha de nacimiento', valor: this.nna.fechaNacimiento ?? '' },
      { nombre: 'Sexo', valor: this.nna.sexoId },
      { nombre: 'País de nacimiento', valor: this.nna.paisId },
      { nombre: 'Régimen de afiliación', valor: this.nna.tipoRegimenSSId },
      { nombre: 'EAPB', valor: this.nna.eapbId },
      { nombre: 'Estado de ingreso a la estrategia', valor: this.nna.estadoIngresoEstrategiaId },
      { nombre: 'Contactos', valor: this.nna.contactos },
    ];

    const camposColombia: { nombre: string, valor: any }[] = [
      { nombre: 'Departamento de nacimiento', valor: this.nna.departamentoNacimientoId },
      { nombre: 'Ciudad de nacimiento', valor: this.nna.municipioNacimientoId },
      { nombre: 'Etnia', valor: this.nna.etniaId },
    ];

    const campos = esColombia ? [...camposBase, ...camposColombia] : camposBase;

    this.campoFaltante = '';
    for (const { nombre, valor } of campos) {
      const esArray = Array.isArray(valor);
      const vacio = esArray
        ? valor.length === 0
        : (valor === null || valor === undefined || valor.toString().trim() === '' || valor.toString() === '0');
      if (vacio) {
        this.campoFaltante = nombre;
        console.log('Campo requerido vacío:', nombre);
        return false;
      }
    }

    return true;
  }

  terminar(){
    this.cancelarExistencia();
  }

  btn_ver_detalle_nna() {
    this.router.navigate([`/usuarios/editar_nna/${this.nna.id}`]).then(() => {
      window.scrollTo(0, 0);
    });
  }

  Probar() {
    this.nnaId = 12;
    this.visibleDialogRolCoordinador = true;
  }
}
