import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TablasParametricas } from '../../../../../core/services/tablasParametricas';
import { TpParametros } from '../../../../../core/services/tpParametros';
import { InfoDiagnostico } from '../../../../../models/infoDiagnostico.model';
import { Parametricas } from '../../../../../models/parametricas.model';
import { SeguimientoAlertasComponent } from '../../seguimiento-alertas/seguimiento-alertas.component';
import { SeguimientoStepsComponent } from '../seguimiento-steps/seguimiento-steps.component';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-seguimiento-fallecido',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, CardModule, SeguimientoStepsComponent, ReactiveFormsModule, CalendarModule, DropdownModule, TableModule, FormsModule, InputTextModule, SeguimientoAlertasComponent],
  templateUrl: './seguimiento-fallecido.component.html',
  styleUrl: './seguimiento-fallecido.component.css'
})
export class SeguimientoFallecidoComponent  implements OnInit {
  estado:string = 'Fallecido';
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
    fechaDefuncion: new Date(),
    causaMuerte: "",
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
