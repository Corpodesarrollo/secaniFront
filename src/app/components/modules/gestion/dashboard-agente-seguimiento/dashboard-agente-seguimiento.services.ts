import { Injectable } from '@angular/core';
import { Generico } from '../../../../core/services/generico';


@Injectable({
  providedIn: 'root'
})
export class DashboardAgenteSeguimientoService {
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


  GetEstadosSeguimientos= async ( FechaInicial: Date, FechaFinal: Date, UsuarioId: string) => {
    let url = `${'Dashboard/GetEstadosSeguimientos?FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal+'&UsuarioId='+UsuarioId}`;
    return await  this.comun.retorno_get(url);
  }

  GetEstadosNNas= async ( FechaInicial: Date, FechaFinal: Date, UsuarioId: string) => {
    let url = `${'Dashboard/GetEstadosNNas?FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal+'&UsuarioId='+UsuarioId}`;
    return await  this.comun.retorno_get(url);
  }

  GetEstadosAlertas= async ( FechaInicial: Date, FechaFinal: Date, UsuarioId: string) => {
    let url = `${'Dashboard/GetEstadosAlertas?FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal+'&UsuarioId='+UsuarioId}`;
    return await  this.comun.retorno_get(url);
  }

  GetEstadosIntentos= async ( FechaInicial: Date, FechaFinal: Date, UsuarioId: string) => {
    let url = `${'Dashboard/GetEstadosIntentos?FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal+'&UsuarioId='+UsuarioId}`;
    return await  this.comun.retorno_get(url);
  }

  GetFechasAsignacion= async ( FechaInicial: Date, FechaFinal: Date, UsuarioId: string) => {
    let url = `${'Dashboard/GetFechasAsignacion?FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal+'&UsuarioId='+UsuarioId}`;
    return await  this.comun.retorno_get(url);
  }

  GetCasosCriticos= async ( FechaInicial: Date, FechaFinal: Date) => {
    let url = `${'Dashboard/GetCasosCriticos?FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal}`;
    return await  this.comun.retorno_get(url);
  }




  GetEstadoSeguimiento = async () => {
    let url = `${'EstadoSeguimiento'}`;
    return await  this.comun.retorno_get_parametrica(url);
  }

  GetEstadoNNA = async () => {
    let url = `${'EstadoNNA'}`;
    return await  this.comun.retorno_get_parametrica(url);
  }

  GetEstadoAlerta = async () => {
    let url = `${'EstadoAlerta'}`;
    return await  this.comun.retorno_get_parametrica(url);
  }

  GetTipoFalla = async () => {
    let url = `${'TipoFallaLlamada'}`;
    return await  this.comun.retorno_get_parametrica(url);
  }

  GetTpEstadoAlerta = async () => {
    let url = `${'EstadoAlerta'}`;
    return await  this.comun.retorno_get_parametrica(url);
  }


  GetInfoUsuario = async (id: any) => {
    let url = `${'User/GetUserDetails/'+id}`;
    return await  this.comun.retorno_get_usuarios(url);
  }


}
