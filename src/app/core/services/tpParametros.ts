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

    async getTpEstadosNNA() {
        var urlbase:string = environment.url_MsNna
        var url = "NNA/TpEstadosNNA";
        return await this.axios.retorno_get(url,urlbase);
    }

    async getTpTipoId() {
        var urlbase:string = environment.url_MsNna
        var url = "NNA/GetTpTipoId";
        return await this.axios.retorno_get(url,urlbase);
    }

    async getTPTipoIdentificacion() {
        var urlbase:string = environment.url_MsNna
        var url = "NNA/GetTPTipoIdentificacion";
        return await this.axios.retorno_get(url,urlbase);
    }

    async getTPRegimenAfiliacion() {
        var urlbase:string = environment.url_MsNna
        var url = "NNA/GetTPRegimenAfiliacion";
        return await this.axios.retorno_get(url,urlbase);
    }

    async getTPParentesco() {
        var urlbase:string = environment.url_MsNna
        var url = "NNA/GetTPParentesco";
        return await this.axios.retorno_get(url,urlbase);
    }

    async getTPPais() {
        var urlbase:string = environment.url_MsNna
        var url = "NNA/GetTPPais";
        return await this.axios.retorno_get(url,urlbase);
    }

    async getTPDepartamento(paisId:any) {
        var urlbase:string = environment.url_MsNna
        var url = "NNA/GetTPDepartamento/"+paisId;
        return await this.axios.retorno_get(url,urlbase);
    }

    async getTPCiudad(departamentoId:any) {
        var urlbase:string = environment.url_MsNna
        var url = "NNA/GetTPCiudad/"+departamentoId;
        return await this.axios.retorno_get(url,urlbase);
    }

    async getTPOrigenReporte() {
        var urlbase:string = environment.url_MsNna
        var url = "NNA/GetTPOrigenReporte";
        return await this.axios.retorno_get(url,urlbase);
    }

    async getGrupoPoblacional() {
        var urlbase:string = environment.url_MsNna
        var url = "NNA/GetGrupoPoblacional";
        return await this.axios.retorno_get(url,urlbase);
    }

    async getTPEtnia() {
        var urlbase:string = environment.url_MsNna
        var url = "NNA/GetTPEtnia";
        return await this.axios.retorno_get(url,urlbase);
    }

    async getTPEAPB() {
        var urlbase:string = environment.url_MsNna
        var url = "NNA/GetTPEAPB";
        return await this.axios.retorno_get(url,urlbase);
    }

    async getTPEstadoIngresoEstrategia() {
        var urlbase:string = environment.url_MsNna
        var url = "NNA/GetTPEstadoIngresoEstrategia";
        return await this.axios.retorno_get(url,urlbase);
    }

    
}