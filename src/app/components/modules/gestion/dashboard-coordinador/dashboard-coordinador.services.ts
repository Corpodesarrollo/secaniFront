import { Injectable } from '@angular/core';
import { Generico } from '../../../../core/services/generico';


@Injectable({
  providedIn: 'root'
})
export class DashboardCoordinadorService {
  constructor(private readonly comun: Generico) {}



  GetTotalCasos = async ( FechaInicial: Date, FechaFinal: Date) => {
    let url = `${'Dashboard/GetTotalCasos?FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal}`;
    return await  this.comun.retorno_get(url);
  }

  GetTotalRegistros= async ( FechaInicial: Date, FechaFinal: Date, EntidadId: string) => {
    let url = `${'Dashboard/GetTotalRegistros?FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal}`;
    return await  this.comun.retorno_get(url);
  }

  GetTotalMisCasos= async ( FechaInicial: Date, FechaFinal: Date, UsuarioId: string) => {
    let url = `${'Dashboard/GetTotalMisCasos?FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal}`;
    return await  this.comun.retorno_get(url);
  }

  GetTotalAlertas= async ( FechaInicial: Date, FechaFinal: Date, UsuarioId: string) => {
    let url = `${'Dashboard/GetTotalAlertas?FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal}`;
    return await  this.comun.retorno_get(url);
  }

  GetEntidadCantidad= async ( FechaInicial: Date, FechaFinal: Date) => {
    let url = `${'Dashboard/GetEntidadCantidad?FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal}`;
    return await  this.comun.retorno_get(url);
  }

  GetEstadosSeguimientos= async ( FechaInicial: Date, FechaFinal: Date, UsuarioId: string) => {
    let url = `${'Dashboard/GetEstadosSeguimientos?FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal}`;
    return await  this.comun.retorno_get(url);
  }

  GetAgenteCantidad= async ( FechaInicial: Date, FechaFinal: Date) => {
    let url = `${'Dashboard/GetAgenteCantidad?FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal}`;
    return await  this.comun.retorno_get(url);
  }

  GetEstadosAlertas= async ( FechaInicial: Date, FechaFinal: Date, UsuarioId: string) => {
    let url = `${'Dashboard/GetEstadosAlertas?FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal}`;
    return await  this.comun.retorno_get(url);
  }

  GetCasosCriticos= async ( FechaInicial: Date, FechaFinal: Date) => {
    let url = `${'Dashboard/GetCasosCriticos?FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal}`;
    return await  this.comun.retorno_get(url);
  }

  GetTotalSeguimientosCuidador= async ( FechaInicial: Date, FechaFinal: Date) => {
    let url = `${'Dashboard/GetTotalSeguimientosCuidador?FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal}`;
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

  GetInfoUsuario = async (id: any) => {
    let url = `${'User/GetUserDetails/'+id}`;
    return await  this.comun.retorno_get_usuarios(url);
  }

  GetTpEstadoAlerta = async () => {
    let url = `${'EstadoAlerta'}`;
    return await  this.comun.retorno_get_parametrica(url);
  }
}
