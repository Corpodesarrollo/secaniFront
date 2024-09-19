import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';
import { environment } from '../../../environments/environment';
import { Generico } from './generico';


@Injectable({
  providedIn: 'root',
})
export class TpParametros {
  constructor(private axios: Generico) {
  }

  async getNNA(id:string) {
    var urlbase: string = environment.url_MsNna;
    var url = `NNA/${id}`;
    return await this.axios.retorno_get(url, urlbase);
  }

  async getEstadoIngresoEstrategia(id: number) {
    var urlbase: string = environment.url_MSParametricas;
    var url = `EstadoIngresoEstrategia/${id}`;
    return await this.axios.retorno_get(url, urlbase);
  }

  async getTpEstadosNNA() {
    var urlbase: string = environment.url_MSTablasParametricas
    var url = "EstadoNNA";
    return await this.axios.retorno_get(url, urlbase);
  }

  async getTPTipoIdentificacion() {
    var urlbase: string = environment.url_MSParametricas;
    var url = "TablaParametrica/APSTipoIdentificacion";
    return await this.axios.retorno_get(url, urlbase);
  }

  async getTPRegimenAfiliacion() {
    var urlbase: string = environment.url_MSParametricas;
    var url = "TablaParametrica/APSRegimenAfiliacion";
    return await this.axios.retorno_get(url, urlbase);
  }

  async getTPParentesco() {
    var urlbase: string = environment.url_MSParametricas;
    var url = "TablaParametrica/RLCPDParentesco";
    return await this.axios.retorno_get(url, urlbase);
  }

  async getTPPais() {
    var urlbase: string = environment.url_MSParametricas;
    var url = "TablaParametrica/Pais";
    return await this.axios.retorno_get(url, urlbase);
  }

  async getTPDepartamento(paisId: any) {
    var urlbase: string = environment.url_MSParametricas;
    var url = "TablaParametrica/Departamento";
    return await this.axios.retorno_get(url, urlbase);
  }

  async getTPCiudad(departamentoId: any) {
    var urlbase: string = environment.url_MSParametricas
    var url = "TablaParametrica/Municipios/" + departamentoId;
    return await this.axios.retorno_get(url, urlbase);
  }

  async getTPOrigenReporte() {
    var urlbase: string = environment.url_MSParametricas
    var url = "OrigenReporte";
    return await this.axios.retorno_get(url, urlbase);
  }

  async getCategoriaAlerta() {
    var urlbase: string = environment.url_MSParametricas
    var url = "CategoriaAlerta";
    return await this.axios.retorno_get(url, urlbase);
  }

  async getSubCategoriaAlerta(id: any) {
    var urlbase: string = environment.url_MSParametricas
    var url = "CategoriaAlerta/Subcategorias/" + id;
    return await this.axios.retorno_get(url, urlbase);
  }

  async getDiagnosticos() {
    var urlbase: string = environment.url_MSParametricas
    var url = "CIE10";
    return await this.axios.retorno_get(url, urlbase);
  }

  async getGrupoPoblacional() {
    var urlbase: string = environment.url_MSParametricas;
    var url = "TablaParametrica/LCETipoPoblacionEspecial";
    return await this.axios.retorno_get(url, urlbase);
  }

  async getTPEtnia() {
    var urlbase: string = environment.url_MSParametricas;
    var url = "TablaParametrica/GrupoEtnico";
    return await this.axios.retorno_get(url, urlbase);
  }

  async getTPEAPB() {
    var urlbase: string = environment.url_MSParametricas
    var url = "TablaParametrica/CodigoEAPByNit";
    return await this.axios.retorno_get(url, urlbase);
  }

  async getTPEstadoIngresoEstrategia() {
    var urlbase: string = environment.url_MSParametricas;
    var url = "EstadoIngresoEstrategia";
    return await this.axios.retorno_get(url, urlbase);
  }

  async getAgentesExistentesAsignados() {
    var urlbase: string = environment.url_MsNna;
    var url = 'NNA/VwAgentesAsignados';
    return await this.axios.retorno_get(url, urlbase);
  }

  async getRazonesSinDiagnostico() {
    var urlbase: string = environment.url_MSParametricas;
    var url = "RazonesSinDiagnostico";
    return await this.axios.retorno_get(url, urlbase);
  }
}
