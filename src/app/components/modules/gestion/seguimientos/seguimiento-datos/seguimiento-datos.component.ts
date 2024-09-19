import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-seguimiento-datos',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, CardModule, SeguimientoStepsComponent, ReactiveFormsModule, 
  DropdownModule, CalendarModule, FormsModule, InputTextModule, SeguimientoHistorialComponent],
  templateUrl: './seguimiento-datos.component.html',
  styleUrl: './seguimiento-datos.component.css'
})

export class SeguimientoDatosComponent implements OnInit {
  nna: NNA = new NNA();
  id: string | undefined;
  fechaMaxima: Date;
  estadoIngreso: string = '';

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

  constructor(private tpp: TpParametros, private fb: FormBuilder, private tp: TablasParametricas, 
  private router: Router, private routeAct: ActivatedRoute, private nnaService: NNAService) {
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
    this.id = this.routeAct.snapshot.paramMap.get('id')!;
    this.nna = await this.tpp.getNNA(this.id);

    this.items = [
      { label: 'Seguimientos', routerLink: '/gestion/seguimientos' },
      { label: `${this.nna.primerNombre} ${this.nna.primerApellido}`, routerLink: `/gestion/seguimientos/datos-seguimiento/${this.id}` },
    ];

    if (this.nna.fechaNacimiento) {
      this.nna.fechaNacimiento = new Date(this.nna.fechaNacimiento);
    }

    this.parentescos = await this.tp.getTP('RLCPDParentesco');
    this.selectedParentesco = this.parentescos.find(x => x.codigo == this.nna.cuidadorParentescoId);
    this.isLoadingParentesco = false;

    this.tipoID = await this.tp.getTP('APSTipoIdentificacion');
    this.selectedTipoID = this.tipoID.find(x => x.codigo == this.nna.tipoIdentificacionId);
    this.isLoadingTipoID = false;

    let estadoIngresoResult = await this.tpp.getEstadoIngresoEstrategia(this.nna.estadoIngresoEstrategiaId);
    this.estadoIngreso = estadoIngresoResult.nombre;

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

    this.EAPB = await this.tp.getTP('CodigoEAPByNit');
    this.selectedEAPB = this.EAPB.find(x => x.codigo == this.nna.eapbId);
    this.isLoadingEAPB = false;

    this.CalcularEdad();
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
    this.submitted2 = true;
    if (this.validarCamposRequeridos()){
      await this.Actualizar();
      this.router.navigate([`/gestion/seguimientos/estado-seguimiento/${this.id}`]).then(() => {
        window.scrollTo(0, 0);
      });
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

    const camposAValidar = [
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
    ];

    // Valida que cada campo no sea nulo, vacío o solo espacios en blanco
    for (const campo of camposAValidar) {
      if (!campo || campo.toString().trim() === '') {
        return false;
      }
    }

    return true;
  }

  async Actualizar() {
    await this.nnaService.putNNA(this.nna);
  }
}
