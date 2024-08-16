import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SeguimientoStepsComponent } from '../seguimiento-steps/seguimiento-steps.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { TablasParametricas } from '../../../../../core/services/tablasParametricas';
import { Parametricas } from '../../../../../models/parametricas.model';
import { TpParametros } from '../../../../../core/services/tpParametros';
import { InfoDiagnostico } from '../../../../../models/infoDiagnostico.model';
import { Router } from '@angular/router';
import { SeguimientoAlertasComponent } from "../../seguimiento-alertas/seguimiento-alertas.component";

@Component({
  selector: 'app-seguimiento-estado',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, CardModule, SeguimientoStepsComponent, ReactiveFormsModule, DropdownModule, CalendarModule, FormsModule, InputTextModule, SeguimientoAlertasComponent],
  templateUrl: './seguimiento-estado.component.html',
  styleUrl: './seguimiento-estado.component.css'
})
export class SeguimientoEstadoComponent  implements OnInit {
  estado:string = 'Registrado';
    
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

  constructor(private tpp: TpParametros, private tp: TablasParametricas, private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    this.items = [
      { label: 'Seguimientos', routerLink: '/gestion/seguimiento' },
      { label: 'Ana Ruiz', routerLink: '/gestion/seguimiento' },
    ];

    this.estados = await this.tpp.getTpEstadosNNA();
    this.isLoadingEstados = false;
    this.diagnosticos =  await this.tpp.getDiagnosticos();
    this.isLoadingDiagnostico = false;

    this.selectedEstado = this.estados.find(x => x.nombre === "Registrado");
  }

  applyRecaida(value: number) {
    this.diagnostico.recaidas = value;
    if(value === 0) {
      this.diagnostico.numeroRecaidas = 0;
    }
  }

  Siguiente() {
    this.router.navigate(['/gestion/seguimiento/traslado-seguimiento']).then(() => {
      window.scrollTo(0, 0);
    });
  }
}
