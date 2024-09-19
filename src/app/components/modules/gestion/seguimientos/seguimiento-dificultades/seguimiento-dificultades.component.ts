import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SeguimientoStepsComponent } from '../seguimiento-steps/seguimiento-steps.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { InfoDificultad } from '../../../../../models/infoDificultad.model';
import { TablasParametricas } from '../../../../../core/services/tablasParametricas';
import { Parametricas } from '../../../../../models/parametricas.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertasTratamiento } from '../../../../../models/alertasTratamiento.model';
import { TpParametros } from '../../../../../core/services/tpParametros';
import { SeguimientoAlertasComponent } from "../../seguimiento-alertas/seguimiento-alertas.component";
import { NNA } from '../../../../../models/nna.model';
import { GenericService } from '../../../../../services/generic.services';
import { NNAService } from '../../../../../core/services/nnaService';

@Component({
  selector: 'app-seguimiento-dificultades',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, CardModule, SeguimientoStepsComponent, ReactiveFormsModule,
    DropdownModule, FormsModule, InputTextModule, CheckboxModule, TableModule, SeguimientoAlertasComponent],
  templateUrl: './seguimiento-dificultades.component.html',
  styleUrl: './seguimiento-dificultades.component.css'
})
export class SeguimientoDificultadesComponent implements OnInit {
  nna: NNA = new NNA();
  id: string | undefined;
  
  dificultades: InfoDificultad = {
    autorizacionMedicamentos: true,
    entregaMedicamentosLAP: false,
    entregaMedicamentosNoLAP: false,
    asignacionCitas: false,
    leHanCobradoCopagosCuotas: false,
    autoriacionProcedimientos: false,
    remisionInstitucionesEspecializadas: false,
    malaAtencionIPS: false,
    malaAtencionIPSCual: '',
    fallasMIPRES: false,
    fallaConventioEAPBeIPS: false,
    alertasTratamiento: undefined,
    haSidoTrasladado: false,
    numeroTraslados: 0,
    idIPS: [],
    haRecurridoAccionLegalAtencion: false,
    motivo: '',
    idTipoRecurso: 0
  };

  selectedTipoRecurso: Parametricas | undefined;
  selectedCategoriaAlerta: Parametricas | undefined;
  selectedSubcategoriaAlerta: Parametricas | undefined;
  selectedIPSCual: Parametricas | undefined;

  isLoadingTipoRecurso: boolean = true;
  isLoadingCategoriaAlerta: boolean = true;
  isLoadingSubcategoriaAlerta: boolean = true;

  tiposRecursos: Parametricas[] = [];
  IPS: Parametricas[] = [];
  categoriaAlerta: Parametricas[] = [];
  subcategoriaAlerta: Parametricas[] = [];
  alertas: AlertasTratamiento[] = [];

  trasladosArray: number[] = [];
  selectedIPS: (Parametricas | null)[] = [];

  estado:string = 'Registrado';
  items: MenuItem[] = [];

  constructor(private tpp: TpParametros, private tp: TablasParametricas, private router: Router, 
    private routeAct: ActivatedRoute, private nnaService: NNAService) {
  }

  async ngOnInit(): Promise<void> {
    this.id = this.routeAct.snapshot.paramMap.get('id')!;
    this.nna = await this.tpp.getNNA(this.id);

    this.items = [
      { label: 'Seguimientos', routerLink: '/gestion/seguimientos' },
      { label: `${this.nna.primerNombre} ${this.nna.primerApellido}`, routerLink: `/gestion/seguimientos/datos-seguimiento/${this.id}` },
    ];

    //this.tiposRecursos =  await this.tp.getTP('TiposRecursos'); ///falta por definir
    //this.IPS =  await this.tp.getTP('IPSCodHabilitacion');
    //this.selectedIPSCual = this.IPS.find(x => x.id == this.nna.ipsId);


    this.categoriaAlerta =  await this.tpp.getCategoriaAlerta();
    this.selectedCategoriaAlerta = this.categoriaAlerta.find(x => x.id == this.nna.ipsId);
    this.isLoadingCategoriaAlerta = false;
  }

  MalaAtencion() {
    if (!this.dificultades.malaAtencionIPS) {
      this.dificultades.malaAtencionIPSCual = '';
    }
  }

  AgregarAlerta() {
    if (!this.selectedCategoriaAlerta || !this.selectedSubcategoriaAlerta) {
      return;
    }

    let existe = false;
    this.alertas.forEach((alerta) => {
      if (alerta.idCategoriaAlerta == this.selectedCategoriaAlerta?.id &&
        alerta.idSubcategoriaAlerta == this.selectedSubcategoriaAlerta?.id) {
        existe = true;
      }
    });

    if (existe) {
      return;
    }

    let alerta: AlertasTratamiento = {
      idCategoriaAlerta: this.selectedCategoriaAlerta?.id || 0,
      categoriaAlerta: this.selectedCategoriaAlerta?.nombre || '',
      idSubcategoriaAlerta: this.selectedSubcategoriaAlerta?.id || 0,
      subcategoriaAlerta: this.selectedSubcategoriaAlerta?.nombre || '',
      resuelta: false
    };

    this.alertas.push(alerta);

    this.selectedCategoriaAlerta = undefined;
    this.selectedSubcategoriaAlerta = undefined;
  }

  BorrarAlerta(index: number) {
    this.alertas.splice(index, 1);
  }

  HaSidoTrasladado(value:boolean) {
    if (!value) {
      this.nna.trasladosNumerodeTraslados = 0;
    }
    else {
      this.nna.trasladosNumerodeTraslados = 1;
    }

    if (this.nna.trasladosHaSidoTrasladadodeInstitucion != value){
      this.nna.trasladosHaSidoTrasladadodeInstitucion = value;
      this.actualizarTrasladosArray();
    }
  }

  AccionesLegales(value:boolean) {
    if (this.nna.trasladosHaRecurridoAccionLegal != value){
      this.nna.trasladosHaRecurridoAccionLegal = value;
    }

    if (!value) {
      this.nna.trasladosMotivoAccionLegal = '';
      this.nna.trasladosTipoAccionLegalId = '';
      this.selectedTipoRecurso = undefined;
    }
  }

  NumeroTraslados() {
    this.actualizarTrasladosArray();
  }

  actualizarTrasladosArray() {
    const nuevoTamano = this.dificultades.numeroTraslados;

    // Ajusta el tamaño de trasladosArray sin borrar valores existentes
    if (nuevoTamano > this.trasladosArray.length) {
      // Si aumentan, agrega elementos
      for (let i = this.trasladosArray.length; i < nuevoTamano; i++) {
        this.trasladosArray.push(i);
        this.selectedIPS.push(null);
      }
    } else if (nuevoTamano < this.trasladosArray.length) {
      // Si disminuyen, recorta el array
      this.trasladosArray.splice(nuevoTamano);
      this.selectedIPS.splice(nuevoTamano);
    }
  }

  async Siguiente() {
    await this.Actualizar();
      this.router.navigate([`/gestion/seguimientos/adherencia-seguimiento/${this.id}`]).then(() => {
        window.scrollTo(0, 0);
      });
  }

  async Actualizar() {
    await this.nnaService.putNNA(this.nna);
  }
}
