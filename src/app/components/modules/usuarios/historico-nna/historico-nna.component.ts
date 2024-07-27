import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import estadosNNA from './json/estadosNNA.json';
import { GenericService } from '../../../../services/generic.services';
import { environment } from '../../../../../environments/environment';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-historico-nna',
  templateUrl: './historico-nna.component.html',
  styleUrl: './historico-nna.component.css'
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

  constructor(private service: GenericService) { }

  async ngOnInit() {
    var url = environment.url_MsNna;
    this.estadosNNA = await this.service.getAsync(url, 'NNA/TpEstadosNNA', '') ?? [];
    this.agenteAsignado = await this.service.getAsync(url, 'NNA/VwAgentesAsignados', '') ?? [];
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
    var url = environment.url_MsNna;
    var parameter: any = {
      estado: this.filtroEstado,
      agente: this.filtroAgente,
      buscar: this.filtroBuscar,
      orden: this.filtroOrganizar
    };
    this.visualizars = await this.service.postAsync(url, 'NNA/ConsultarNNAFiltro', parameter) ?? [];
    console.log("HU Visualizar", this.visualizars);
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

  /**Paginador */
  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  isLastPage(): boolean {
    return this.visualizars ? this.first === this.visualizars.length - this.rows : true;
  }

  isFirstPage(): boolean {
    return this.visualizars ? this.first === 0 : true;
  }

}
