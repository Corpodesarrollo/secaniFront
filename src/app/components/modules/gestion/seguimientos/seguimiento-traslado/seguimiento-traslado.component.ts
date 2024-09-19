import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SeguimientoStepsComponent } from '../seguimiento-steps/seguimiento-steps.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TablasParametricas } from '../../../../../core/services/tablasParametricas';
import { Parametricas } from '../../../../../models/parametricas.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TpParametros } from '../../../../../core/services/tpParametros';
import { InfoTraslado } from '../../../../../models/infoTraslado.model';
import { NNA } from '../../../../../models/nna.model';
import { GenericService } from '../../../../../services/generic.services';

@Component({
  selector: 'app-seguimiento-traslado',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, CardModule, SeguimientoStepsComponent, ReactiveFormsModule, DropdownModule, FormsModule, InputTextModule],
  templateUrl: './seguimiento-traslado.component.html',
  styleUrl: './seguimiento-traslado.component.css'
})
export class SeguimientoTrasladoComponent implements OnInit {
  nna: NNA = new NNA();
  id: string | undefined;
  saving: boolean = false;
  
  traslado: InfoTraslado = {
    id: 0,
    idSeguimiento: 0,
    requirioTraslado: false,
    idDepartamentoProcedencia: 0,
    idMunicipioProcedencia: 0,
    barrioProcedencia: '',
    idAreaProcedencia: 0,
    direccionProcedencia: '',
    idEstratoProcedencia: 0,
    telefonoProcedencia: '',
    idDepartamentoActual: 0,
    idMunicipioActual: 0,
    barrioActual: '',
    idAreaActual: 0,
    direccionActual: '',
    idEstratoActual: 0,
    telefonoActual: '',
    tieneCapacidadAsumirTraslado: false,
    EAPBApoyoTraslado: false,
    apoyoEntregadoOportunidad: false,
    apoyoConCoberturaTraslado: false,
    haSolicitadoApoyoFundacion: false,
    nombreFundacion: '',
    apoyoRecibidoFundacion: '',
    idTipoRecidenciaActual: 0,
    OtroRecidenciaActual: '',
    quienAsumeCostoTraslado: '',
    quienAsumeCostoVivienda: ''
  };

  selectedDepartamentoProcedencia: Parametricas | undefined;
  selectedMunicipioProcedencia: Parametricas | undefined;
  selectedAreaProcedencia: Parametricas | undefined;  
  selectedDepartamentoActual: Parametricas | undefined;
  selectedMunicipioActual: Parametricas | undefined;
  selectedBarrioActual: Parametricas | undefined;
  selectedAreaActual: Parametricas | undefined;
  selectedTipoRecidenciaActual: Parametricas | undefined;
  selectedEstratoProcedencia: Parametricas | undefined;
  selectedEstratoActual: Parametricas | undefined;

  isLoadingDepartamentoProcedencia: boolean = true;
  isLoadingMunicipioProcedencia: boolean = false;
  isLoadingMunicipioActual: boolean = false;
  isLoadingAreaProcedencia: boolean = true;
  isLoadingEstratoProcedencia: boolean = true;
  isLoadingTipoRecidenciaActual: boolean = true;

  estratos: Parametricas[] = [];
  departamentos: Parametricas[] = [];
  municipiosProcedencia: Parametricas[] = [];
  municipiosActual: Parametricas[] = [];
  areas: Parametricas[] = [];
  tiposRecidencia: Parametricas[] = [];
  
  submitted2: boolean = false;
  estado:string = 'Registrado';
  items: MenuItem[] = [];

  constructor(private tpp: TpParametros, private tp: TablasParametricas, private router: Router, private routeAct: ActivatedRoute, private repos: GenericService) {
  }

  async ngOnInit(): Promise<void> {
    this.id = this.routeAct.snapshot.paramMap.get('id')!;
    this.nna = await this.tpp.getNNA(this.id);

    this.items = [
      { label: 'Seguimientos', routerLink: '/gestion/seguimientos' },
      { label: `${this.nna.primerNombre} ${this.nna.primerApellido}`, routerLink: `/gestion/seguimientos/datos-seguimiento/${this.id}` },
    ];

    this.departamentos = await this.tp.getTP('Departamento');
    this.selectedDepartamentoProcedencia = this.departamentos.find(x => x.codigo == this.nna.residenciaOrigenCategoriaId);
    this.isLoadingDepartamentoProcedencia = false;

    this.areas = await this.tp.getTP('ZonaTerritorial');
    this.selectedAreaProcedencia = this.areas.find(x => x.codigo == this.nna.residenciaOrigenAreaId);
    this.isLoadingAreaProcedencia = false;

    this.estratos = await this.tp.getTP('EstratoSocioeconomico');
    this.selectedEstratoProcedencia = this.estratos.find(x => x.codigo == this.nna.residenciaOrigenEstratoId);
    this.isLoadingEstratoProcedencia = false;

    this.tiposRecidencia = await this.tp.getTP('RIBATipoVivienda');
    this.selectedTipoRecidenciaActual = this.tiposRecidencia.find(x => x.codigo == this.nna.trasladosPropietarioResidenciaActualId );
    this.isLoadingTipoRecidenciaActual = false;
  }

  async CargarMunicipios(tipo: string) {
    if (tipo === 'Procedencia') {
      this.isLoadingMunicipioProcedencia = true;
      this.municipiosProcedencia = [];
      if (this.selectedDepartamentoProcedencia) {
        this.municipiosProcedencia = await this.tpp.getTPCiudad(this.selectedDepartamentoProcedencia.codigo);
      }
      this.selectedMunicipioProcedencia = this.municipiosProcedencia.find(x => x.codigo == this.nna.residenciaOrigenMunicipioId);
      this.isLoadingMunicipioProcedencia = false;
    } else {
      this.isLoadingMunicipioActual = true;
      this.municipiosActual = [];
      if (this.selectedDepartamentoActual) {
        this.municipiosActual = await this.tpp.getTPCiudad(this.selectedDepartamentoActual.codigo);
      }
      this.selectedMunicipioActual = this.municipiosActual.find(x => x.codigo == this.nna.residenciaActualMunicipioId);
      this.isLoadingMunicipioActual = false;
    }
  }

  ApoyoFundacion(value: boolean) {
    this.traslado.haSolicitadoApoyoFundacion = value;
    if (!value) {
      this.traslado.nombreFundacion = '';
      this.traslado.apoyoRecibidoFundacion = '';
    }
  }

  async Siguiente() {
    this.submitted2 = true;
    if (this.validarCamposRequeridos()){
      this.saving = true;
      await this.Actualizar();
      this.router.navigate([`/gestion/seguimientos/dificultades-seguimiento/${this.id}`]).then(() => {
        window.scrollTo(0, 0);
      });
    }
    this.saving = false;
  }

  validarCamposRequeridos(): boolean {
    this.nna.residenciaOrigenCategoriaId = this.selectedDepartamentoProcedencia?.codigo ?? '';
    this.nna.residenciaOrigenMunicipioId = this.selectedMunicipioProcedencia?.codigo ?? '';
    this.nna.residenciaOrigenAreaId = this.selectedAreaProcedencia?.codigo ?? '';
    this.nna.residenciaOrigenEstratoId = this.selectedEstratoProcedencia?.codigo ?? '';

    const camposAValidar = [
      this.nna.residenciaOrigenCategoriaId,
      this.nna.residenciaOrigenMunicipioId,
      this.nna.residenciaOrigenBarrio,
      this.nna.residenciaOrigenAreaId,
      this.nna.residenciaOrigenDireccion,
      this.nna.residenciaOrigenEstratoId,
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
    this.nna.residenciaActualCategoriaId = this.selectedDepartamentoActual?.codigo ?? '';
    this.nna.residenciaActualMunicipioId = this.selectedMunicipioActual?.codigo ?? '';
    this.nna.residenciaActualAreaId = this.selectedAreaActual?.codigo ?? '';
    this.nna.residenciaActualEstratoId = this.selectedEstratoActual?.codigo ?? '';
    this.nna.trasladosPropietarioResidenciaActualId = this.selectedTipoRecidenciaActual?.codigo ?? '';

    return new Promise((resolve, reject) => {
      this.repos.put('NNA/Actualizar', this.nna, 'NNA').subscribe({
        next: (data: any) => {
          resolve(data);
        },
        error: (err) => {
          console.error(err);
          reject(err);
        }
      });
    });
  }
}
