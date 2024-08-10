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
import { Router } from '@angular/router';
import { TpParametros } from '../../../../../core/services/tpParametros';
import { InfoTraslado } from '../../../../../models/infoTraslado.model';

@Component({
  selector: 'app-seguimiento-traslado',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, CardModule, SeguimientoStepsComponent, ReactiveFormsModule, DropdownModule, FormsModule, InputTextModule],
  templateUrl: './seguimiento-traslado.component.html',
  styleUrl: './seguimiento-traslado.component.css'
})
export class SeguimientoTrasladoComponent implements OnInit {
  traslado: InfoTraslado = {
    id: 0,
    idSeguimiento: 0,
    requirioTraslado: false,
    idDepartamentoProcedencia: 0,
    idMunicipioProcedencia: 0,
    idBarrioProcedencia: 0,
    idAreaProcedencia: 0,
    direccionProcedencia: '',
    estratoProcedencia: 0,
    telefonoProcedencia: '',
    idDepartamentoActual: 0,
    idMunicipioActual: 0,
    idBarrioActual: 0,
    idAreaActual: 0,
    direccionActual: '',
    estratoActual: 0,
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
  selectedBarrioProcedencia: Parametricas | undefined;
  selectedAreaProcedencia: Parametricas | undefined;
  selectedDepartamentoActual: Parametricas | undefined;
  selectedMunicipioActual: Parametricas | undefined;
  selectedBarrioActual: Parametricas | undefined;
  selectedAreaActual: Parametricas | undefined;
  selectedTipoRecidenciaActual: Parametricas | undefined;

  departamentos: Parametricas[] = [];
  municipios: Parametricas[] = [];
  barrios: Parametricas[] = [];
  areas: Parametricas[] = [];
  tiposRecidencia: Parametricas[] = [];
  
  estado:string = 'Registrado';
  items: MenuItem[] = [];

  constructor(private tpp: TpParametros, private tp: TablasParametricas, private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    this.items = [
      { label: 'Seguimientos', routerLink: '/gestion/seguimiento' },
      { label: 'Ana Ruiz', routerLink: '/gestion/seguimiento' },
    ];

    this.departamentos = this.tp.getTP('Departamentos');
    this.municipios = this.tp.getTP('Municipios');
    this.barrios = this.tp.getTP('Barrios');
    this.areas = this.tp.getTP('Areas');
    this.tiposRecidencia = this.tp.getTP('TipoRecidencia');
  }

  ApoyoFundacion(value: boolean) {
    this.traslado.haSolicitadoApoyoFundacion = value;
    if (!value) {
      this.traslado.nombreFundacion = '';
      this.traslado.apoyoRecibidoFundacion = '';
    }
  }

  Siguiente() {
    this.router.navigate(['/gestion/seguimiento/dificultades-seguimiento']).then(() => {
      window.scrollTo(0, 0);
    });
  }
}
