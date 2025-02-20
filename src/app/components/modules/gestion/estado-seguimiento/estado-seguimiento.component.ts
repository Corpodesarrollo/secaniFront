import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TablasParametricas } from '../../../../core/services/tablasParametricas';
import { TpParametros } from '../../../../core/services/tpParametros';
import { User } from '../../../../core/services/userService';
import { NNA } from '../../../../models/nna.model';
import { Parametricas } from '../../../../models/parametricas.model';
import { Seguimiento } from '../../../../models/seguimiento.model';
import { SeguimientoCntFiltros } from '../../../../models/seguimientoCntFiltros.model';
import { GenericService } from '../../../../services/generic.services';
import { BotonNotificacionComponent } from '../../boton-notificacion/boton-notificacion.component';
import { ButtonModule } from 'primeng/button';
import { SeguimientoStepsComponent } from "../seguimientos/seguimiento-steps/seguimiento-steps.component";
import { StepsModule } from 'primeng/steps';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-estado-seguimiento',
  standalone: true,
  imports: [TableModule, BadgeModule, CardModule, CommonModule, StepsModule, RouterModule, DialogModule, ButtonModule, SeguimientoStepsComponent, DropdownModule, InputTextModule, FormsModule, ReactiveFormsModule, ToastModule],
  templateUrl: './estado-seguimiento.component.html',
  styleUrl: './estado-seguimiento.component.css',
  providers: [MessageService]
})
export class EstadoSeguimientoComponent {
  nna: NNA = new NNA();
  idUsuario: string = "48e6efab-2c8a-4d37-bc6c-d62ec8fdd0c5";
  // idUsuario?: string;
  cntFiltros: SeguimientoCntFiltros = {
    hoy: 0,
    conAlerta: 0,
    todos: 0,
    solicitadosPorCuidador: 0
  };
  seguimientos: Seguimiento[] = [];
  data: Seguimiento | undefined;
  mensajeCarga: string = 'Cargando datos...';
  colorMensaje: string = 'text-primary';
  activeFilter: string = '1';
  show: boolean = false;
  isLoading = false;

  itemsStep = [
    { label: 'Solicitado', date: '12/06/2024' },
    { label: 'Agente asignado', date: '12/06/2024' },
    { label: 'Agendado', date: '12/06/2024' },
    { label: 'Contactado', date: '12/06/2024' },
  ];

  activeIndex = 0;

  isLoadingTipoID: boolean = true;
  isLoadingParentesco: boolean = true;

  parentescos: Parametricas[] = [];
  tipoID: Parametricas[] = [];

  selectedTipoID: Parametricas | undefined;
  selectedParentesco: Parametricas | undefined;

  public visible: boolean = false;
  public estaFallecido: boolean = false; // Controla el diálogo de mensaje de fallecimiento
  public hayRecaida: boolean = false;
  public esMenorEdad: boolean = false;
  public estaRegistrado: boolean = true;

  public nnaInfo: { nombre: string, identificacion: string } = { nombre: '', identificacion: '' };
recaidadOpciones: any[]|undefined;
  
  constructor(
      private messageService: MessageService,
      private router: Router,
      private repos: GenericService,
      private tp: TablasParametricas,
      private tpp: TpParametros,
      private user: User
    ) {
  }
  
  async ngOnInit(): Promise<void> {
    this.tipoID = await this.tp.getTP('APSTipoIdentificacion');
    this.isLoadingTipoID = false;

    this.parentescos = await this.tpp.getParentescos();
    this.isLoadingParentesco = false;
    
    this.CargarDatos('1');
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const highlightedStep = document.querySelector('.p-steps-item.p-highlight');
      if (highlightedStep) {
        highlightedStep.classList.remove('p-highlight');
      }
    });
  }

  CargarDatos(filter: string) {
    this.repos.get('Seguimiento/GetSeguimientosEstados/', `${filter}`, 'Seguimiento').subscribe({
      next: (data: any) => {
        this.seguimientos = data;
      }
    });
  }

  consultarSeguimiento(data: Seguimiento) {
    this.isLoading = true;
    this.data = data;
    
    if (this.data.fechaUltimaActuacion != null) {
      this.activeIndex = 3;
      console.log("fechaUltimaActuacion", this.data.fechaUltimaActuacion);
    } else if (this.data.fechaSeguimiento != null) {
      this.activeIndex = 2;
      console.log("fechaSeguimiento", this.data.fechaSeguimiento);
    } else if (this.data.fechaAsignacion != null) {
      this.activeIndex = 1;
      console.log("fechaAsignacion", this.data.fechaAsignacion);
    } else if (this.data.fechaSolicitud != null) {
      this.activeIndex = 0;
      console.log("fechaSolicitud", this.data.fechaSolicitud);
    }

    console.log("activeIndex", this.activeIndex);

    this.show = true;
    this.isLoading = false;
  }

  showDialog(): void {
    this.visible = true;
  }

  hiddenDialog(): void {
    this.visible = false;
    this.estaFallecido = false;
    this.esMenorEdad = false;
    this.hayRecaida = false;
    this.estaRegistrado = true;
  }

  closeInformacionDialog() {
    this.estaFallecido = false;
    this.esMenorEdad = false;
    this.hayRecaida = false;
    this.estaRegistrado = true;
  }

  onSubmitSeguimiento(): void {
    // if( this.seguimientoForm.invalid ) return;
    // this.estaFallecido = true;
    // this.esMenorEdad = true;
    // this.hayRecaida = true;

    this.estaRegistrado = false;
    this.nnaInfo = {
      nombre: 'Ana Maria Luiz Bolaños',
      identificacion: 'R.C. 1.035.201.226'
    }
  }

  onSubmitRecaida(): void {
    // if ( this.recaidaForm.invalid ) return;

    this.messageService.add({
      severity: 'success',
      summary: 'Seguimiento solicitado con éxito',
    });

    this.hiddenDialog();
  }
}
