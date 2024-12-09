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
  rolIdGeneral = sessionStorage.getItem('roleId');

  listaContactos: ContactoNNA[] = [];

  visible: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private tpParametros: TpParametros,
    private axios: Generico,
    private tp: TablasParametricas,
    private nnaService: NNAService
  ) {
    //createdByUserId
    this.userId = sessionStorage.getItem('userId');
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

    this.EAPB = await this.tp.getTP('CodigoEAPByNit');
    this.selectedEAPB = this.EAPB.find((x) => x.codigo == this.nna.eapbId);
    this.isLoadingEAPB = false;

    this.estadosIngresoEstrategia = await this.tpParametros.getEstadosIngresoEstrategia();
    this.selectedEstadoIngresoEstrategia = this.estadosIngresoEstrategia.find(x => x.id == this.nna.estadoId);
    this.isLoadingEstadosIngresoEstrategia = false;

    this.departamentos = await this.tp.getTP('Departamento');
    this.selectedDepartamento = this.departamentos.find(
      (x) => x.codigo == this.nna.residenciaOrigenCategoriaId,
    );
    this.isLoadingDepartamento = false;

    //Inicializando form
    this.nna.edad = '';
    this.userId = sessionStorage.getItem('userId');

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
    this.nna.tipoIdentificacionId = this.selectedTipoID?.codigo ?? '';
    if (this.nna.numeroIdentificacion && this.nna.tipoIdentificacionId) {
      const url = `NNA/ConsultarNNAsByTipoIdNumeroId/${this.nna.tipoIdentificacionId}/${this.nna.numeroIdentificacion}`;
      try {
        const response: any = await this.axios.retorno_get(url, baseUrl);
        if (response && Object.keys(response).length > 0) {
          this.nna.id = response.id;
          this.visible = true;
        } else {
          this.nnaFormCrearSinActivar = false;
          console.log('Response is empty or invalid');
        }
      } catch (error) {
        console.error('Error validating existence:', error);
      }
    }
  }

  cancelarExistencia() {
    this.nnaFormCrearSinActivar = true;
    this.nna.numeroIdentificacion = '';
    this.nna.tipoIdentificacionId = '';
    this.selectedTipoID = undefined;
    this.nna = new NNA();
    this.nna.edad = '';
    this.submitted2 = false;
  }

  async ciudad(departamento: any) {
    this.isLoadingMunicipio = true;
    this.municipios = [];
    if (this.selectedDepartamento) {
      this.municipios = await this.tpParametros.getTPCiudad(
        this.selectedDepartamento.codigo,
      );
    }
    this.selectedMunicipio = this.municipios.find(
      (x) => x.codigo == this.nna.residenciaActualMunicipioId,
    );
    this.isLoadingMunicipio = false;
  }

  //Guardar formulario
  async onSubmit() {
    this.submitted = true;
    if (this.validarCamposRequeridos()) {
      let result = await this.nnaService.postNNA(this.nna);
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
        console.log('Error en la validación de los campos');
      }
    }
    else {
      console.log('Error en la validación de los campos');
    }
  }

  validarCamposRequeridos(): boolean {
    this.nna.cuidadorParentescoId = this.selectedParentesco?.codigo ?? '';
    this.nna.tipoIdentificacionId = this.selectedTipoID?.codigo ?? '';
    this.nna.paisId = this.selectedPaisNacimiento?.codigo ?? '';
    this.nna.etniaId = this.selectedEtnia?.codigo ?? '';
    this.nna.grupoPoblacionId = this.selectedGrupoPoblacional?.codigo ?? '';
    this.nna.tipoRegimenSSId = this.selectedRegimenAfiliacion?.codigo ?? '';
    this.nna.eapbId = this.selectedEAPB?.codigo ?? '';
    this.nna.origenReporteId = this.selectedOrigenReporte?.id ?? 0;
    this.nna.municipioNacimientoId = this.selectedMunicipio?.codigo ?? '';
    this.nna.estadoIngresoEstrategiaId = this.selectedEstadoIngresoEstrategia?.id ?? 0;
    this.nna.contactos = this.listaContactos;

    let camposAValidar: (string | number | Date | ContactoNNA[])[] = [];

    if(this.nna.paisId == '170'){
      camposAValidar = [
        this.nna.origenReporteId,
        this.nna.primerNombre,
        this.nna.segundoApellido,
        this.nna.tipoIdentificacionId,
        this.nna.numeroIdentificacion,
        this.nna.fechaNacimiento,
        this.nna.sexoId,
        this.nna.paisId,
        this.nna.municipioNacimientoId,
        this.nna.etniaId,
        this.nna.tipoRegimenSSId,
        this.nna.eapbId,
        this.nna.grupoPoblacionId,
        this.nna.estadoIngresoEstrategiaId,
        this.nna.tipoRegimenSSId,
        this.nna.contactos,
      ];
    }
    else{
      camposAValidar = [
        this.nna.origenReporteId,
        this.nna.primerNombre,
        this.nna.segundoApellido,
        this.nna.tipoIdentificacionId,
        this.nna.numeroIdentificacion,
        this.nna.fechaNacimiento,
        this.nna.sexoId,
        this.nna.paisId,
        this.nna.etniaId,
        this.nna.tipoRegimenSSId,
        this.nna.eapbId,
        this.nna.grupoPoblacionId,
        this.nna.estadoIngresoEstrategiaId,
        this.nna.tipoRegimenSSId,
        this.nna.contactos,
      ];
    }


    // Valida que cada campo no sea nulo, vacío o solo espacios en blanco
    for (const campo of camposAValidar) {
      if (!campo || campo.toString().trim() === '') {
        console.log('Campo requerido vacío:', campo);
        return false;
      }
    }

    return true;
  }

  btn_ver_detalle_nna() {
    this.router.navigate([`/usuarios/editar_nna/${this.nna.id}`]).then(() => {
      window.scrollTo(0, 0);
    });
  }
}
