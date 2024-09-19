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
import { TablasParametricas } from '../../../../../core/services/tablasParametricas';
import { Parametricas } from '../../../../../models/parametricas.model';
import { ActivatedRoute, Router } from '@angular/router';
import { InfoAdherencia } from '../../../../../models/infoAdherencia.model';
import { NNA } from '../../../../../models/nna.model';
import { TpParametros } from '../../../../../core/services/tpParametros';
import { NNAService } from '../../../../../core/services/nnaService';

@Component({
  selector: 'app-seguimiento-adherencia',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, CardModule, SeguimientoStepsComponent, ReactiveFormsModule,
            DropdownModule, FormsModule, InputTextModule, CheckboxModule, TableModule],
  templateUrl: './seguimiento-adherencia.component.html',
  styleUrl: './seguimiento-adherencia.component.css'
})

export class SeguimientoAdherenciaComponent implements OnInit {
  nna: NNA = new NNA();
  id: string | undefined;
  
  adherencia: InfoAdherencia ={
    id: 0,
    haInasistidoTratamiento: false,
    tiempoInasistencia: 0,
    idUnidadTiempo: 0,
    idCausaInasistencia: 0,
    causaInasistenciaOtra: '',
    estudiandoActualmente: false,
    haInasistidoEstudio: false,
    tiempoInasistenciaEstudio: 0,
    idUnidadTiempoEstudio: 0,
    hanInformadoDiagnosticos: false,
    observacion: ''
  };
  unidadesTiempo: Parametricas[] = [];
  causasInasistencia: Parametricas[] = [];

  selectedUnidadTiempo: Parametricas | undefined;
  selectedUnidadTiempo2: Parametricas | undefined;
  selectedCausaInasistencia: Parametricas | undefined;

  isLoadingUnidadesTiempo: boolean = true;
  isLoadingCausasInasistencia: boolean = true;

  estado:string = 'Registrado';
  items: MenuItem[] = [];

  constructor(private tpp: TpParametros, private tp: TablasParametricas, private router: Router, private routeAct: ActivatedRoute, private nnaService: NNAService) {
  }

  async ngOnInit(): Promise<void> {
    this.id = this.routeAct.snapshot.paramMap.get('id')!;
    this.nna = await this.tpp.getNNA(this.id);

    this.items = [
      { label: 'Seguimientos', routerLink: '/gestion/seguimientos' },
      { label: `${this.nna.primerNombre} ${this.nna.primerApellido}`, routerLink: `/gestion/seguimientos/datos-seguimiento/${this.id}` },
    ];

    this.unidadesTiempo =  await this.tp.getTP('UnidadesTiempo');
    this.isLoadingUnidadesTiempo = false;

    this.causasInasistencia =  await this.tp.getTP('CausasInasistencia');
    this.isLoadingCausasInasistencia = false;
  }

  HaInasistidoTratamiento(value: boolean) {
    this.nna.tratamientoHaDejadodeAsistir = value;
    if (value) {
      this.nna.tratamientoCuantoTiemposinAsistir = 1;
    }
  }

  EstudiandoActualmente(value: boolean) {
    this.nna.tratamientoEstudiaActualmente = value;
    if (!value) {
      this.nna.tratamientoHaDejadodeAsistirColegio = false;
      this.nna.tratamientoTiempoInasistenciaColegio = 0;
      this.nna.tratamientoCausasInasistenciaId = '';
      this.selectedUnidadTiempo2 = undefined;
    }
  }

  HaInasistidoEstudio(value: boolean) {
    this.nna.tratamientoHaDejadodeAsistirColegio = value;
    if (value) {
      this.nna.tratamientoTiempoInasistenciaColegio = 1;
    }
  }

  Siguiente() {
    // this.router.navigate(['/gestion/seguimiento/dificultades-seguimiento']).then(() => {
    //   window.scrollTo(0, 0);
    // });
  }

  async Actualizar() {
    this.nna.tratamientoUnidadMedidaIdTiempoId = this.selectedUnidadTiempo?.codigo ?? '';
    this.nna.tratamientoTiempoInasistenciaUnidadMedidaId = this.selectedUnidadTiempo2?.codigo ?? '';
    this.nna.tratamientoCausasInasistenciaId = this.selectedCausaInasistencia?.codigo  ?? '';
    await this.nnaService.putNNA(this.nna);
  }
}
