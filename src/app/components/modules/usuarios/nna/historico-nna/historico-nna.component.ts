import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { GenericService } from '../../../../../services/generic.services';
import { environment } from '../../../../../../environments/environment';
import { Route, Router, RouterModule } from '@angular/router';
import { TpParametros } from '../../../../../core/services/tpParametros';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BotonNotificacionComponent } from "../../../boton-notificacion/boton-notificacion.component";
import { NNA } from '../../../../../models/nna.model';
import { apis } from '../../../../../models/apis.model';

@Component({
  selector: 'app-historico-nna',
  standalone: true,
  imports: [TableModule, BadgeModule, CardModule, ProgressSpinnerModule, CommonModule, IconFieldModule, InputIconModule, InputTextModule, ReactiveFormsModule, FormsModule, BotonNotificacionComponent],
  templateUrl: './historico-nna.component.html',
  styleUrls: ['../../general.component.css', './historico-nna.component.css']
})

export class HistoricoNnaComponent {
  visualizars!: any;

  public filtroEstado: any = 0;
  public filtroAgente: any = "";
  public filtroBuscar: any = "";
  public filtroOrganizar: any = 1;

  public estadosNNA: any;
  public agenteAsignado: any;

  first = 0;
  rows = 10;

  mostrar = false;

  permisos_nna: any = {
    canAdd: true,
    canDel: false,
    canView: false,
    CanEdit: false
  }

  constructor(private service: GenericService, private router: Router, private tpParametro: TpParametros) {
    //this.limpiar();
  }

  async ngOnInit() {
    this.estadosNNA = await this.tpParametro.getTpEstadosNNA() ?? [];
    this.agenteAsignado = await this.tpParametro.getAgentesExistentesAsignados() ?? [];
    this.buscar();
  }

  async limpiar() {
    this.filtroEstado = 0;
    this.filtroAgente = "";
    this.filtroBuscar = "";
    this.filtroOrganizar = 1;
    this.buscar();
  }

  async buscar() {
    this.mostrar = false;
    var url = environment.url_MsNna;
    var parameter: any = {
      estado: this.filtroEstado,
      agente: this.filtroAgente,
      buscar: this.filtroBuscar,
      orden: this.filtroOrganizar
    };
    this.service.post('NNA/ConsultarNNAFiltro', parameter, apis.nna).subscribe({
      next: (data: any) => {
        this.visualizars = data;
      }
    });
    this.mostrar = true;
  }


  /**
   * Cambiando datos
   */
  onFiltroEstadoChange(event: any): void {
    //console.log('Estado cambiado:', event);
    this.buscar(); // Llama a la función de búsqueda
  }

  onFiltroAgenteChange(event: any): void {
    //console.log('Agente asignado cambiado:', event);
    this.buscar(); // Llama a la función de búsqueda
  }

  onFiltroBuscarChange(event: any): void {
    //console.log('Buscar cambiado:', event);
    this.buscar(); // Llama a la función de búsqueda
  }

  onFiltroOrganizarChange(event: any): void {
    //console.log('Orden cambiado:', event);
    this.buscar(); // Llama a la función de búsqueda
  }

  btn_crear_nna() {
    this.router.navigate(["/usuarios/crear_nna"]);
  }

  redirigirDetalleNna(idNna: string): void {
    this.router.navigate(["/usuarios/detalle_nna/", idNna]);
  }

}
