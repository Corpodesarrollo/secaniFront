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
import { User } from '../../../../core/services/user';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-consultar-seguimientos',
  standalone: true,
  imports: [TableModule, BadgeModule, CardModule, CommonModule, BotonNotificacionComponent, RouterModule, DialogModule, FormsModule, InputTextModule, IconFieldModule, InputIconModule],
  templateUrl: './consultar-seguimientos.component.html',
  styleUrl: './consultar-seguimientos.component.css',
  encapsulation: ViewEncapsulation.None
})

export class ConsultarSeguimientosComponent implements OnInit {
  nna: NNA = new NNA();
  xUser = new User();
  idUsuario: string = '';
  cntFiltros: SeguimientoCntFiltros = {
    hoy: 0,
    conAlerta: 0,
    todos: 0,
    solicitadosPorCuidador: 0
  };
  seguimientos: Seguimiento[] = [];
  seguimientosOriginal: Seguimiento[] = [];
  estadosNNA: Parametricas[] = [];
  filtroEstado: number | string = 0;
  filtroBuscar: string = '';
  mensajeCarga: string = 'Cargando datos...';
  colorMensaje: string = 'text-primary';
  activeFilter: string = '1';
  showDialog: boolean = false;
  isLoading = false;
  parentesco: Parametricas | undefined;
  diagnostico: Parametricas | undefined;

  parentescos: Parametricas[] = [];
  diagnosticos: Parametricas[] = [];

  constructor(
    private router: Router,
    private repos: GenericService,
    private tp: TablasParametricas,
    private tpp: TpParametros
  ) { }

  async ngOnInit(): Promise<void> {
    // BUG-017 + BUG-LZ-006: leer userId fresco desde localStorage (no via field-init que cachea entre cambios de usuario)
    this.xUser = new User();
    this.idUsuario = this.xUser.id ?? '';
    if (!this.idUsuario) {
      console.warn('Usuario no autenticado');
      return;
    }

    this.estadosNNA = await this.tpp.getTpEstadosNNA();

    this.CargarDatos('1');

    this.repos.get('Seguimiento/GetCntSeguimiento/', `${this.idUsuario}`, 'Seguimiento').subscribe({
      next: (data: any) => {
        this.cntFiltros = data;
      }
    });
  }

  applyFilter(filter: string) {
    this.activeFilter = filter;
    this.CargarDatos(filter);
  }

  CargarDatos(filter: string) {
    this.repos.get('Seguimiento/GetAllByIdUser/', `${this.idUsuario}/${filter}`, 'Seguimiento').subscribe({
      next: (data: any) => {
        this.seguimientosOriginal = Array.isArray(data) ? data : [];
        this.aplicarFiltros();
      }
    });
  }

  aplicarFiltros() {
    const estadoId = Number(this.filtroEstado) || 0;
    const txt = (this.filtroBuscar || '').toLowerCase().trim();
    this.seguimientos = this.seguimientosOriginal.filter(s => {
      if (estadoId > 0 && Number(s.estado?.id) !== estadoId) return false;
      if (txt) {
        const haystack = [
          String(s.noCaso ?? ''),
          (s.nombreCompleto ?? '').toLowerCase(),
          (s.asuntoUltimaActuacion ?? '').toLowerCase(),
          (s.estado?.nombre ?? '').toLowerCase()
        ].join(' ');
        if (!haystack.includes(txt)) return false;
      }
      return true;
    });
  }

  intentosLlamada(id: number) {
    console.log("Valor enviado: ", { state: { id_seguimiento : id} } );
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
}
