import { Injectable } from '@angular/core';
import { Generico } from '../../../../core/services/generico';


@Injectable({
  providedIn: 'root'
})
export class DashboardCoordinadorService {
  constructor(private comun: Generico) {}



  GetTotalCasos = async ( FechaInicial: Date, FechaFinal: Date, EntidadId: string) => {
    let url = `${'Dashboard/GetTotalCasos?FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal+'&EntidadId='+EntidadId}`;
    return await  this.comun.retorno_get(url);
  }

  GetTotalRegistros= async ( FechaInicial: Date, FechaFinal: Date, EntidadId: string) => {
    let url = `${'Dashboard/GetTotalRegistros?FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal+'&EntidadId='+EntidadId}`;
    return await  this.comun.retorno_get(url);
  }

  GetTotalMisCasos= async ( FechaInicial: Date, FechaFinal: Date, UsuarioId: string) => {
    let url = `${'Dashboard/GetTotalMisCasos?FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal+'&UsuarioId='+UsuarioId}`;
    return await  this.comun.retorno_get(url);
  }

  GetTotalAlertas= async ( FechaInicial: Date, FechaFinal: Date, UsuarioId: string) => {
    let url = `${'Dashboard/GetTotalAlertas?FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal+'&UsuarioId='+UsuarioId}`;
    return await  this.comun.retorno_get(url);
  }

  GetEntidadCantidad= async ( FechaInicial: Date, FechaFinal: Date) => {
    let url = `${'Dashboard/GetEntidadCantidad?FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal}`;
    return await  this.comun.retorno_get(url);
  }

  GetEstadosSeguimientos= async ( FechaInicial: Date, FechaFinal: Date, UsuarioId: string) => {
    let url = `${'Dashboard/GetEstadosSeguimientos?FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal+'&UsuarioId='+UsuarioId}`;
    return await  this.comun.retorno_get(url);
  }

  GetAgenteCantidad= async ( FechaInicial: Date, FechaFinal: Date) => {
    let url = `${'Dashboard/GetAgenteCantidad?FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal}`;
    return await  this.comun.retorno_get(url);
  }

  GetEstadosAlertas= async ( FechaInicial: Date, FechaFinal: Date, UsuarioId: string) => {
    let url = `${'Dashboard/GetEstadosAlertas?FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal+'&UsuarioId='+UsuarioId}`;
    return await  this.comun.retorno_get(url);
  }


  // Parametricas

  GetEstadoSeguimiento = async () => {
    let url = `${'EstadoSeguimiento'}`;
    return await  this.comun.retorno_get_parametrica(url);
  }

  GetEstadoAlerta = async () => {
    let url = `${'EstadoAlerta'}`;
    return await  this.comun.retorno_get_parametrica(url);
  }
}
