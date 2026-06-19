import { Injectable } from '@angular/core';
import { Generico } from '../../../../core/services/generico';


@Injectable({
  providedIn: 'root'
})
export class DashboardEapbService {
  constructor(private readonly comun: Generico) {}



  GetTotalCasos = async ( FechaInicial: Date, FechaFinal: Date) => {
    let url = `${'Dashboard/GetTotalCasos?FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal}`;
    return await  this.comun.retorno_get(url);
  }

  GetRegistrosPropios= async ( FechaInicial: Date, FechaFinal: Date, EntidadId: string) => {
    let url = `${'Dashboard/GetRegistrosPropios?FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal+'&EntidadId='+EntidadId}`;
    return await  this.comun.retorno_get(url);
  }

  GetTotalAlertasEAPB= async ( FechaInicial: Date, FechaFinal: Date, EntidadId: string) => {
    let url = `${'Dashboard/GetTotalAlertasEAPB?FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal+'&EntidadId='+EntidadId}`;
    return await  this.comun.retorno_get(url);
  }

  GetEstadosAlertasEAPB= async ( FechaInicial: Date, FechaFinal: Date, EntidadId: string) => {
    let url = `${'Dashboard/GetEstadosAlertasEAPB?FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal+'&EntidadId='+EntidadId}`;
    return await  this.comun.retorno_get(url);
  }

  GetTiposCasos= async ( FechaInicial: Date, FechaFinal: Date, EntidadId: string) => {
    let url = `${'Dashboard/GetTiposCasos?FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal+'&EntidadId='+EntidadId}`;
    return await  this.comun.retorno_get(url);
  }

  GetCasosCriticosEAPB= async (EntidadId: string, FechaInicial: Date, FechaFinal: Date,) => {
    let url = `${'Dashboard/GetCasosCriticosEAPB?FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal+'&EntidadId='+EntidadId}`;
    return await  this.comun.retorno_get(url);
  }




  GetEstadoAlerta = async () => {
    let url = `${'EstadoAlerta'}`;
    return await  this.comun.retorno_get_parametrica(url);
  }

  // HU SECANI-RQ07-HU01: pie "Alertas" agrupa por categoria de la alerta, no por estado.
  GetCategoriaAlerta = async () => {
    let url = `${'CategoriaAlerta'}`;
    return await this.comun.retorno_get_parametrica(url);
  }

  // BUG-LZ-087: resolver TPEAPB.Id desde el NIT del usuario (enterpriseIdentification)
  GetEAPBIdByNit = async (nit: string | number) => {
    let url = `${'Dashboard/GetEAPBIdByNit?nit=' + nit}`;
    return await this.comun.retorno_get(url);
  }

}
