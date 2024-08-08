import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SeguimientoStepsComponent } from '../seguimiento-steps/seguimiento-steps.component';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TablasParametricas } from '../../../../../core/services/tablasParametricas';
import { parametricas } from '../../../../../models/parametricas.model';
import { NNA } from '../../../../../models/nna.model';
import { TpParametros } from '../../../../../core/services/tpParametros';
import { InfoDiagnostico } from '../../../../../models/infoDiagnostico.model';

@Component({
  selector: 'app-seguimiento-estado',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, CardModule, SeguimientoStepsComponent, ReactiveFormsModule, DropdownModule, CalendarModule, FormsModule],
  templateUrl: './seguimiento-estado.component.html',
  styleUrl: './seguimiento-estado.component.css'
})
export class SeguimientoEstadoComponent  implements OnInit {
  estado:string = 'Registrado';
    
  items: MenuItem[] = [];
  estados: parametricas[] = [];
  diagnosticos: parametricas[] = [];
  IPS: parametricas[] = [];

  selectedDiagnostico: parametricas | undefined;
  selectedEstado: parametricas | undefined;
  selectedIPS: parametricas | undefined;

  diagnostico: InfoDiagnostico = {
    id: 0,
    idSeguimiento: 0,
    idEstado: 0,
    tipoDiagnostico: 0,
    fechaConsulta: new Date(),
    IPSActual: 0,
    recaidas: 0,
    numeroRecaidas: 0
  };

  constructor(private tpp: TpParametros, private tp: TablasParametricas) {
  }

  onSubmit() {
  }

  async ngOnInit(): Promise<void> {
    this.items = [
      { label: 'Seguimientos', routerLink: '/gestion/seguimiento' },
      { label: 'Ana Ruiz', routerLink: '/gestion/seguimiento' },
    ];

    this.estados = await this.tpp.getTpEstadosNNA();
    this.selectedEstado = this.estados[2];
  }

  applyRecaida(value: number) {
    this.diagnostico.recaidas = value;
    if(value === 0) {
      this.diagnostico.numeroRecaidas = 0;
    }
  }
}
