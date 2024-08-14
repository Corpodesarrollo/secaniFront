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
import { Router } from '@angular/router';
import { AlertasTratamiento } from '../../../../../models/alertasTratamiento.model';
import { TpParametros } from '../../../../../core/services/tpParametros';

@Component({
  selector: 'app-seguimiento-dificultades',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, CardModule, SeguimientoStepsComponent, ReactiveFormsModule,
            DropdownModule, FormsModule, InputTextModule, CheckboxModule, TableModule],
  templateUrl: './seguimiento-dificultades.component.html',
  styleUrl: './seguimiento-dificultades.component.css'
})
export class SeguimientoDificultadesComponent implements OnInit {

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

  constructor(private tpp: TpParametros, private tp: TablasParametricas, private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    this.items = [
      { label: 'Seguimientos', routerLink: '/gestion/seguimiento' },
      { label: 'Ana Ruiz', routerLink: '/gestion/seguimiento' },
    ];

    //this.tiposRecursos =  await this.tp.getTP('TiposRecursos'); ///falta por definir
    this.IPS =  await this.tp.getTP('IPSCodHabilitacion');
    this.categoriaAlerta =  await this.tpp.getCategoriaAlerta();
    this.isLoadingCategoriaAlerta = false;
    this.subcategoriaAlerta =  await this.tpp.getSubCategoriaAlerta();
    this.isLoadingSubcategoriaAlerta = false;
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
      subcategoriaAlerta: this.selectedSubcategoriaAlerta?.nombre || ''
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
      this.dificultades.numeroTraslados = 0;
    }
    else {
      this.dificultades.numeroTraslados = 1;
    }

    if (this.dificultades.haSidoTrasladado != value){
      this.dificultades.haSidoTrasladado = value;
      this.actualizarTrasladosArray();
    }
  }

  AccionesLegales(value:boolean) {
    if (this.dificultades.haRecurridoAccionLegalAtencion != value){
      this.dificultades.haRecurridoAccionLegalAtencion = value;
    }

    if (!value) {
      this.dificultades.motivo = '';
      this.dificultades.idTipoRecurso = 0;
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

  Siguiente() {
    this.router.navigate(['/gestion/seguimiento/adherencia-seguimiento']).then(() => {
      window.scrollTo(0, 0);
    });
  }
}
