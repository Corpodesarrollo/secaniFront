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
import { Router } from '@angular/router';
import { InfoAdherencia } from '../../../../../models/infoAdherencia.model';

@Component({
  selector: 'app-seguimiento-adherencia',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, CardModule, SeguimientoStepsComponent, ReactiveFormsModule,
            DropdownModule, FormsModule, InputTextModule, CheckboxModule, TableModule],
  templateUrl: './seguimiento-adherencia.component.html',
  styleUrl: './seguimiento-adherencia.component.css'
})

export class SeguimientoAdherenciaComponent implements OnInit {
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

  estado:string = 'Registrado';
  items: MenuItem[] = [];

  constructor(private tp: TablasParametricas, private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    this.items = [
      { label: 'Seguimientos', routerLink: '/gestion/seguimiento' },
      { label: 'Ana Ruiz', routerLink: '/gestion/seguimiento' },
    ];

    this.unidadesTiempo = this.tp.getTP('UnidadesTiempo');
    this.causasInasistencia = this.tp.getTP('CausasInasistencia');
  }

  HaInasistidoTratamiento(value: boolean) {
    this.adherencia.haInasistidoTratamiento = value;
    if (value) {
      this.adherencia.tiempoInasistencia = 1;
    }
  }

  EstudiandoActualmente(value: boolean) {
    this.adherencia.estudiandoActualmente = value;
    if (!value) {
      this.adherencia.haInasistidoEstudio = false;
      this.adherencia.tiempoInasistenciaEstudio = 0;
      this.adherencia.idUnidadTiempoEstudio = 0;
      this.selectedUnidadTiempo2 = undefined;
    }
  }

  HaInasistidoEstudio(value: boolean) {
    this.adherencia.haInasistidoEstudio = value;
    if (value) {
      this.adherencia.tiempoInasistenciaEstudio = 1;
    }
  }

  Siguiente() {
    this.router.navigate(['/gestion/seguimiento/dificultades-seguimiento']).then(() => {
      window.scrollTo(0, 0);
    });
  }
}
