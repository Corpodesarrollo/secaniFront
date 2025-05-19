import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { Seguimiento } from '../../../../models/seguimiento.model';
import { CommonModule } from '@angular/common';
import { BotonNotificacionComponent } from "../../boton-notificacion/boton-notificacion.component";
import { GenericService } from '../../../../services/generic.services';
import { SeguimientoCntFiltros } from '../../../../models/seguimientoCntFiltros.model';
import { Router, RouterModule } from '@angular/router';
import { TpParametros } from '../../../../core/services/tpParametros';
import { NNA } from '../../../../models/nna.model';
import { DialogModule } from 'primeng/dialog';
import { TablasParametricas } from '../../../../core/services/tablasParametricas';
import { Parametricas } from '../../../../models/parametricas.model';
import { Injectable } from "@angular/core";
import { User } from '../../../../core/services/userService';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-asignacion-seguimiento',
  standalone: true,
  imports: [TableModule, BadgeModule, CardModule, CommonModule, BotonNotificacionComponent, RouterModule, DialogModule, CheckboxModule, ButtonModule, ToastModule, FormsModule, InputTextModule, CalendarModule, DropdownModule, MultiSelectModule],
  templateUrl: './asignacion-seguimiento.component.html',
  styleUrls: ['./asignacion-seguimiento.component.css'],
  providers: [MessageService]
})
export class AsignacionSeguimientoComponent implements OnInit {

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
  mensajeCarga: string = 'Cargando datos...';
  colorMensaje: string = 'text-primary';
  activeFilter: string = '1';
  showDialog: boolean = false;
  isLoading = false;
  parentesco: Parametricas | undefined;
  diagnostico: Parametricas | undefined;

  parentescos: Parametricas[] = [];
  diagnosticos: Parametricas[] = [];

  selectedRecords: any[] = [];
  showDialogSeleccionados: boolean = false;
  showDialogAgente: boolean = false;

  agentes = [
    { label: 'Agente 1', value: 'agente1' },
    { label: 'Agente 2', value: 'agente2' },
    { label: 'Agente 3', value: 'agente3' }
  ];

  agente: any;
  motivo: any = '';

  constructor(
    private router: Router,
    private repos: GenericService,
    private tp: TablasParametricas,
    private tpp: TpParametros,
    private user: User,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    // this.idUsuario = this.user.id;
    console.log("idUsuario", this.idUsuario);

    this.CargarDatos('1');

    this.repos.get('Seguimiento/GetCntSeguimiento/', `${this.idUsuario}`, 'Seguimiento').subscribe({
      next: (data: any) => {
        this.cntFiltros = data;
      }
    });
  }

  applyFilter(filter: string) {
    this.activeFilter = filter;
    this.selectedRecords = [];
    this.CargarDatos(filter);
  }

  CargarDatos(filter: string) {
    this.repos.get('Seguimiento/GetAllByIdUser/', `${this.idUsuario}/${filter}`, 'Seguimiento').subscribe({
      next: (data: any) => {
        this.seguimientos = data;
      }
    });
  }

  intentosLlamada(id: number) {
    this.router.navigate(['/intento-seguimiento'], { state: { id_seguimiento : id} });
  }

  async solicitudCuidador(caso: number) {
    this.mensajeCarga = 'Cargando datos...';
    this.colorMensaje = 'text-primary';
    this.showDialog = true;
    this.isLoading = true;

    try {
      this.nna = await this.tpp.getNNA(caso.toString());
      this.CalcularEdad();

      this.parentescos = await this.tp.getTP('RLCPDParentesco');
      this.parentesco = this.parentescos.find(x => x.id == this.nna.cuidadorParentescoId);

      this.diagnosticos =  await this.tpp.getDiagnosticos();
      this.diagnostico = this.diagnosticos.find(x => x.id == this.nna.diagnosticoId);
    } catch (error) {
      console.error("Error al cargar los datos", error);
      this.colorMensaje = 'text-danger';
      this.mensajeCarga = 'Error al cargar los datos';
    } finally {
      this.isLoading = false;
    }
  }

  CalcularEdad() {
    if (this.nna.fechaNacimiento) {
      const nacimiento = new Date(this.nna.fechaNacimiento);
      const hoy = new Date();

      let años = hoy.getFullYear() - nacimiento.getFullYear();
      let meses = hoy.getMonth() - nacimiento.getMonth();
      let días = hoy.getDate() - nacimiento.getDate();

      if (días < 0) {
        meses--;
        días += new Date(hoy.getFullYear(), hoy.getMonth(), 0).getDate();
      }

      if (meses < 0) {
        años--;
        meses += 12;
      }

      this.nna.edad = `${años} años, ${meses} meses, ${días} días`;
    }
  }

  getBadgeColor(estadoAlerta: number): string {
    switch (estadoAlerta) {
      case 4: // Resuelta
        return 'bg-success'; // Verde
      case 1 || 2:
        return 'bg-warning'; // Amarillo
      case 3:
        return 'bg-danger'; // Rojo
      case 5:
        return 'bg-danger'; // Gris
      default:
        return 'bg-secondary'; // Por defecto
    }
  }

  onRowEditCancel(segimiento: any): void {
    this.selectedRecords = this.selectedRecords.filter(r => r !== segimiento);

    if(this.selectedRecords.length==0){
      this.showDialogSeleccionados = false;
      this.showDialogAgente = false;
    }
  }

  asignarSeleccion(): void {
    if(this.selectedRecords.length != 0){
      this.showDialogSeleccionados = true;
    }else{
      this.messageService.add({ severity: 'warn', summary: 'Importante', detail: 'Seleccione al menos un caso.' });
    }
  }

  closeVistaPrevia(): void {
    this.showDialogSeleccionados = false;
  }

  openSeleccionarAgente(): void {
    this.showDialogSeleccionados = false;
    this.showDialogAgente = true;
  }

  closeSeleccionarAgente(): void {
    this.showDialogAgente = false;
  }

  onSelectionChange(event: any[]): void {
    this.selectedRecords = event;
  }

  quitarSeleccionado(caso: any): void {
    this.selectedRecords = this.selectedRecords.filter(
      (item) => item !== caso
    );
  }

  reasignarCasos(): void {

    if (this.agente == undefined || this.agente == null) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Seleccione un agente.' });
    }

    if (this.motivo == '' || this.motivo == null) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe registrar motivo.' });
    }

    this.showDialogAgente = false;

    console.log(this.selectedRecords);

  }


}
