import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { Seguimiento } from '../../../../models/seguimiento.model';
import { CommonModule } from '@angular/common';
import { BotonNotificacionComponent } from "../../boton-notificacion/boton-notificacion.component";
import { GenericService } from '../../../../services/generic.services';
import { SeguimientoCntFiltros } from '../../../../models/seguimientoCntFiltros.model';
import { RouterModule } from '@angular/router';
import { TpParametros } from '../../../../core/services/tpParametros';
import { NNA } from '../../../../models/nna.model';
import { DialogModule } from 'primeng/dialog';
import { TablasParametricas } from '../../../../core/services/tablasParametricas';
import { Parametricas } from '../../../../models/parametricas.model';

@Component({
  selector: 'app-consultar-seguimientos',
  standalone: true,
  imports: [TableModule, BadgeModule, CardModule, CommonModule, BotonNotificacionComponent, RouterModule, DialogModule],
  templateUrl: './consultar-seguimientos.component.html',
  styleUrl: './consultar-seguimientos.component.css',
  encapsulation: ViewEncapsulation.None
})

export class ConsultarSeguimientosComponent implements OnInit {
  nna: NNA = new NNA();
  idUsuario: string = "48e6efab-2c8a-4d37-bc6c-d62ec8fdd0c5";
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

  constructor(
    private repos: GenericService,
    private tp: TablasParametricas,
    private tpp: TpParametros
  ) { }

  ngOnInit(): void {
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
        this.seguimientos = data;
      }
    });
  }

  async solicitudCuidador(caso: number) {
    this.mensajeCarga = 'Cargando datos...';
    this.colorMensaje = 'text-primary';
    this.showDialog = true;
    this.isLoading = true;  

    try {
      this.nna = await this.tpp.getNNA(caso.toString());

      this.parentescos = await this.tp.getTP('RLCPDParentesco');
      this.parentesco = this.parentescos.find(x => x.codigo == this.nna.cuidadorParentescoId);

      if (this.diagnosticos && Array.isArray(this.diagnosticos)) {
        this.diagnostico = this.diagnosticos.find(x => x.id == this.nna.diagnosticoId);
      }
      
      this.CalcularEdad();
      
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
        return ' '; // Verde
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
