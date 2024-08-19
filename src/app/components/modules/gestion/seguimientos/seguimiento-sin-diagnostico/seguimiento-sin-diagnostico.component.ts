import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CardModule } from 'primeng/card';
import { SeguimientoStepsComponent } from '../seguimiento-steps/seguimiento-steps.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SeguimientoAlertasComponent } from '../../seguimiento-alertas/seguimiento-alertas.component';
import { MenuItem } from 'primeng/api';
import { Parametricas } from '../../../../../models/parametricas.model';
import { InfoDiagnostico } from '../../../../../models/infoDiagnostico.model';
import { TpParametros } from '../../../../../core/services/tpParametros';
import { TablasParametricas } from '../../../../../core/services/tablasParametricas';
import { ActivatedRoute, Router } from '@angular/router';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-seguimiento-sin-diagnostico',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, CardModule, SeguimientoStepsComponent, ReactiveFormsModule, DropdownModule, TableModule, FormsModule, InputTextModule, SeguimientoAlertasComponent],
  templateUrl: './seguimiento-sin-diagnostico.component.html',
  styleUrl: './seguimiento-sin-diagnostico.component.css'
})
export class SeguimientoSinDiagnosticoComponent  implements OnInit {
  estado:string = 'Sin Diagnóstico';
  items: MenuItem[] = [];
  estados: Parametricas[] = [];
  diagnosticos: Parametricas[] = [];
  IPS: Parametricas[] = [];

  selectedDiagnostico: Parametricas | undefined;
  selectedEstado: Parametricas | undefined;
  selectedIPS: Parametricas | undefined;

  isLoadingDiagnostico: boolean = true;
  isLoadingEstados: boolean = true;
  isLoadingIPS: boolean = true;

  estadoFallecido: boolean = false;
  estadoEnTratamiento: boolean = false;
  estadoSinTratamiento: boolean = false;
  estadoSinDiagnostico: boolean = false;
  concatenatedAlertas: string = '';

  diagnostico: InfoDiagnostico = {
    id: 0,
    idSeguimiento: 0,
    idEstado: 0,
    tipoDiagnostico: 0,
    fechaConsulta: new Date(),
    IPSActual: 0,
    recaidas: 0,
    numeroRecaidas: 0,
    otrasRazones: "",
    observaciones: "",
    alertas: []
  };

  constructor(private tpp: TpParametros, private tp: TablasParametricas, private router: ActivatedRoute) {
  }

  async ngOnInit(): Promise<void> {
    this.router.paramMap.subscribe(() => {
      this.diagnostico = history.state.diagnostico;
    });

    if (this.diagnostico) {
      if (this.diagnostico.alertas) {
       this.concatenatedAlertas = this.diagnostico.alertas.map(alerta => alerta.categoriaAlerta).join(', ');
      }
    } else {
      console.error('El objeto diagnostico no fue pasado correctamente.');
      // Opcional: inicializar con un objeto vacío o redirigir
      this.diagnostico = {
        id: 0,
        idSeguimiento: 0,
        idEstado: 0,
        tipoDiagnostico: 0,
        fechaConsulta: new Date(),
        IPSActual: 0,
        recaidas: 0,
        numeroRecaidas: 0,
        otrasRazones: "",
        alertas: [],
        observaciones: "" // Asegúrate de incluir todas las propiedades necesarias
      };
      this.concatenatedAlertas = '';
    }

    this.items = [
      { label: 'Seguimientos', routerLink: '/gestion/seguimiento' },
      { label: 'Ana Ruiz', routerLink: '/gestion/seguimiento' },
    ];

    this.estados = await this.tpp.getTpEstadosNNA();
    this.isLoadingEstados = false;
    this.diagnosticos =  await this.tpp.getDiagnosticos();
    this.isLoadingDiagnostico = false;
  }
}
