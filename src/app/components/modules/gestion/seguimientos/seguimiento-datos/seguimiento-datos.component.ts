import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SeguimientoStepsComponent } from '../seguimiento-steps/seguimiento-steps.component';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { TablasParametricas } from '../../../../../core/services/tablasParametricas';
import { Parametricas } from '../../../../../models/parametricas.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NNA } from '../../../../../models/nna.model';
import { TpParametros } from '../../../../../core/services/tpParametros';
import { GenericService } from '../../../../../services/generic.services';
import { NNAService } from '../../../../../core/services/nnaService';
import { SeguimientoHistorialComponent } from "../seguimiento-historial/seguimiento-historial.component";
import { Seguimiento } from '../../../../../models/seguimiento.model';
import { SeguimientoDatosService } from './seguimiento-datos.service';
import { DialogModule } from 'primeng/dialog';
import { IntentoComponent } from '../../../usuarios/intento-seguimiento/intento/intento.component';
import { UsuariosModule } from "../../../usuarios/usuarios.module";
import { DialogCrearContactoComponent } from "../../../usuarios/nna-contacto/dialog-crear-contacto/dialog-crear-contacto.component";
import { NnaContactoListaComponent } from "../../../usuarios/nna-contacto/nna-contacto-lista/nna-contacto-lista.component";
import { EstadoNnaComponent } from "../../../estado-nna/estado-nna.component";
import { apis } from '../../../../../models/apis.model';
import { ContactoNNA } from '../../../../../models/contactoNNA.model';
import { SeguimientoGuardarComponent } from "../seguimiento-guardar/seguimiento-guardar.component";
import { SeguimientoGestion } from '../../../../../models/seguimientoGestion.model';

@Component({
  selector: 'app-seguimiento-datos',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, CardModule, SeguimientoStepsComponent, ReactiveFormsModule,
    DropdownModule, CalendarModule, FormsModule, InputTextModule, SeguimientoHistorialComponent, DialogModule, UsuariosModule, DialogCrearContactoComponent, NnaContactoListaComponent, EstadoNnaComponent, SeguimientoGuardarComponent],
  templateUrl: './seguimiento-datos.component.html',
  styleUrl: './seguimiento-datos.component.css'
})

export class SeguimientoDatosComponent implements OnInit {
  @ViewChild(IntentoComponent) intentoComponent!: IntentoComponent;
  nna: NNA = new NNA();
  id: string | undefined;
  contacto: ContactoNNA = {
    id: 0,
    nnaId: 0,
    nombres: '',
    parentescoId: 0,
    parentesco: '',
    cuidador: false,
    telefonos: '',
    email: '',
    estado: false
  };
  
  idContacto: string | undefined;
  fechaMaxima: Date;
  estadoIngreso: string = '';
  estado: string = '';
  colorTxt: string = 'white';
  colorBg: string = '#73b7ad';
  cntSeguimientos: number = 0;

  listadoContacto: any[] = [];
  displayModalContacto: boolean = false;
  nnaFormCrearSinActivar = false;

  selectedTipoID: Parametricas | undefined;
  selectedPaisNacimiento: Parametricas | undefined;
  selectedEtnia: Parametricas | undefined;
  selectedGrupoPoblacional: Parametricas | undefined;
  selectedRegimenAfiliacion: Parametricas | undefined;
  selectedEAPB: Parametricas | undefined;
  selectedParentesco: Parametricas | undefined;
  selectedOrigenReporte: Parametricas | undefined;

  isLoadingTipoID: boolean = true;
  isLoadingPaisNacimiento: boolean = true;
  isLoadingEtnia: boolean = true;
  isLoadingGrupoPoblacional: boolean = true;
  isLoadingRegimenAfiliacion: boolean = true;
  isLoadingEAPB: boolean = true;
  isLoadingParentesco: boolean = true;
  isLoadingOrigenReporte: boolean = true;
  
  items: MenuItem[] = [];
  contactForm: FormGroup;
  submitted: boolean = false;
  submitted2: boolean = false;

  parentescos: Parametricas[] = [];
  tipoID: Parametricas[] = [];
  origenReporte: Parametricas[] = [];
  paisNacimiento: Parametricas[] = [];
  etnias: Parametricas[] = [];
  gruposPoblacionales: Parametricas[] = [];
  regimenAfiliacion: Parametricas[] = [];
  EAPB: Parametricas[] = [];
  saving: boolean | undefined;

  showGuardarSeguimiento: boolean = false;

  constructor(private tpp: TpParametros, private fb: FormBuilder, private tp: TablasParametricas, private gs: GenericService,
  private router: Router, private routeAct: ActivatedRoute, private nnaService: NNAService, private ss: SeguimientoDatosService) {
    this.contactForm = this.fb.group({
      nombre: ['', [Validators.required]],
      parentesco: ['', [Validators.required]],
      telefono1: ['', [Validators.required]],
      telefono2: ['', [Validators.required]]
    });
    this.fechaMaxima = new Date();
  }

  onSubmit() {
    this.submitted = true;
    if (this.contactForm.valid) {
      console.log('Formulario enviado', this.contactForm.value);
      this.contactForm.reset();
    } else {
      console.log('Formulario no válido');
    }
  }

  async ngOnInit(): Promise<void> {
    this.id = this.routeAct.snapshot.paramMap.get('idNNA')!;
    this.idContacto = this.routeAct.snapshot.paramMap.get('idContacto')!;

    this.validarSeguimiento(Number(this.id));

    this.nna = await this.tpp.getNNA(this.id);
    if (!this.nna){
      this.nna = new NNA();
    }

    this.gs.getAsync('ContactoNNAs/Obtener', `/${this.idContacto}`, apis.nna).then(async (data: any) => {
      this.contacto = data.datos;
      this.parentescos = await this.tpp.getParentescos();
      this.selectedParentesco = this.parentescos.find(x => x.id == Number(this.contacto.parentescoId));
      this.isLoadingParentesco = false;
    }).catch((error: any) => {
      console.error('Error fetching contact list', error);
    });

    this.items = [
      { label: 'Seguimientos', routerLink: '/gestion/seguimientos' },
      { label: `${this.nna.primerNombre} ${this.nna.primerApellido}`, routerLink: `/gestion/seguimientos/datos-seguimiento/${this.id}` },
    ];

    if (this.nna.fechaNacimiento) {
      this.nna.fechaNacimiento = new Date(this.nna.fechaNacimiento);
    }

    this.tipoID = await this.tp.getTP('APSTipoIdentificacion');
    this.selectedTipoID = this.tipoID.find(x => x.codigo == this.nna.tipoIdentificacionId);
    this.isLoadingTipoID = false;

    let estadoIngresoResult = await this.tpp.getEstadoIngresoEstrategia(this.nna.estadoIngresoEstrategiaId);
    this.estadoIngreso = estadoIngresoResult?.nombre ?? '';

    this.origenReporte = await this.tpp.getTPOrigenReporte();
    this.selectedOrigenReporte = this.origenReporte.find(x => x.id == this.nna.origenReporteId);
    this.isLoadingOrigenReporte = false;

    this.paisNacimiento = await this.tp.getTP('Pais');
    this.selectedPaisNacimiento = this.paisNacimiento.find(x => x.codigo == this.nna.paisId);
    this.isLoadingPaisNacimiento = false;

    this.etnias =  await this.tp.getTP('GrupoEtnico');
    this.selectedEtnia = this.etnias.find(x => x.codigo == this.nna.etniaId);
    this.isLoadingEtnia = false;

    this.gruposPoblacionales = await this.tp.getTP('LCETipoPoblacionEspecial');
    this.selectedGrupoPoblacional = this.gruposPoblacionales.find(x => x.codigo == this.nna.grupoPoblacionId);
    this.isLoadingGrupoPoblacional = false;

    this.regimenAfiliacion = await this.tp.getTP('APSRegimenAfiliacion');
    this.selectedRegimenAfiliacion = this.regimenAfiliacion.find(x => x.codigo == this.nna.tipoRegimenSSId);
    this.isLoadingRegimenAfiliacion = false;

    this.EAPB = await this.tpp.getTPEAPB();
    this.selectedEAPB = this.EAPB.find(x => x.id == this.nna.eapbId);
    this.isLoadingEAPB = false;

    this.CalcularEdad();
  }

  validarSeguimiento(id: number) {
    this.gs.getAsync('Seguimiento/GetCntSeguimientoByNNA', `/${id}`, apis.seguimiento).then((data: any) => {
      let cnt = Number(data);
      console.log('cnt', cnt);
      if (cnt > 1) {
        this.router.navigate([`/gestion/seguimientos/estado-seguimiento/${this.id}`], {
          state: { idContacto: this.idContacto, skipGuard: true }
        }).then(() => {
          window.scrollTo(0, 0);
        });
        return;
      }
    }).catch((error: any) => {
      console.error('Error fetching contact list', error);
    });
  }

  onModalHide(){
    this.resetChildState();
  }

  closeModal() {
    this.displayModalContacto = false; // Cierra el modal
  }

  resetChildState() {
    if (this.intentoComponent) {
      this.intentoComponent.resetFormState();
    }
  }

  nuevoContacto(){
    this.displayModalContacto = true;
  }

  async handleDataContacto(data: any) {
    this.listadoContacto = data;
    console.log('Data received from child handleDataContacto:', 'Crear nna contacto', data);
  }

  applySexo(sexo: string) {
    this.nna.sexoId = sexo;
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

  async Siguiente() {
    if(this.saving){
      return;
    }
    this.submitted2 = true;
    this.saving = true;

    if (this.validarCamposRequeridos()){
      await this.Actualizar();
      this.router.navigate([`/gestion/seguimientos/estado-seguimiento/${this.id}`], {
        state: { idContacto: this.idContacto, skipGuard: true }
      }).then(() => {
        window.scrollTo(0, 0);
      });
    }
    this.saving = false;
  }

  validarCamposRequeridos(): boolean {
    this.nna.cuidadorParentescoId = this.selectedParentesco?.id ?? 0;
    this.nna.tipoIdentificacionId = this.selectedTipoID?.codigo ?? '';
    this.nna.paisId = this.selectedPaisNacimiento?.codigo ?? '';
    this.nna.etniaId = this.selectedEtnia?.codigo ?? '';
    this.nna.grupoPoblacionId = this.selectedGrupoPoblacional?.codigo ?? '';
    this.nna.tipoRegimenSSId = this.selectedRegimenAfiliacion?.codigo ?? '';
    this.nna.eapbId = this.selectedEAPB?.id ?? 0;
    this.nna.origenReporteId = this.selectedOrigenReporte?.id ?? 0;

    const camposAValidar = [
      this.nna.origenReporteId,
      this.nna.primerNombre,
      this.nna.primerApellido,
      this.nna.tipoIdentificacionId,
      this.nna.numeroIdentificacion,
      this.nna.fechaNacimiento,
      this.nna.sexoId,
      this.nna.paisId,
      this.nna.etniaId,
      this.nna.tipoRegimenSSId,
      this.nna.eapbId,
    ];

    // Valida que cada campo no sea nulo, vacío o solo espacios en blanco
    let pos = 0;
    for (const campo of camposAValidar) {
      pos++;
      if (!campo || campo.toString().trim() === '' || campo === '0') {
        console.log('Campo requerido vacío', pos);
        return false;
      }
    }

    return true;
  }

  async Actualizar() {
    await this.nnaService.putNNA(this.nna);
  }

  abrirGuardarYReagendar() {
    this.showGuardarSeguimiento = true;
  }

  cerrarGuardarYReagendar() {
    this.showGuardarSeguimiento = false;
  }

  get seguimientoActual(): SeguimientoGestion {
    return {
      nnaId: this.nna.id ? Number(this.nna.id): 0,
      fechaSeguimiento: new Date(),
      estadoId: 1,
      contactoNNAId: this.idContacto ? Number(this.idContacto): 0,
      telefono: '',
      usuarioId: 'abc',
      solicitanteId: 0,
      fechaSolicitud: new Date(),
      tieneDiagnosticos: false,
      observacionesSolicitante: '',
      observacionAgente: '',
      ultimaActuacionAsunto: '',
      ultimaActuacionFecha: new Date(),
      nombreRechazo: '',
      parentescoRechazo: '',
      razonesRechazo: '',
      alertas: [],
      alertasPendientes: []
    };
  }
}
