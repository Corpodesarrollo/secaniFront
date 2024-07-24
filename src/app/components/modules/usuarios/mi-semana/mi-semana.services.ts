import { Injectable } from '@angular/core';
import { Generico } from '../../../../core/services/generico';


@Injectable({
  providedIn: 'root'
})
export class MiSemanaService {
  constructor(private comun: Generico) {}



  GetSeguimientoUsuario = async (UsuarioId: number, FechaInicial: Date, FechaFinal: Date) => {
    let url = `${'Seguimiento/GetSeguimientoUsuario?UsuarioId='+UsuarioId+'+&FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal}`;
    return await  this.comun.retorno_get(url);
  }

  GetFestivos = async (FechaInicial: Date, FechaFinal: Date) => {
    let url = `${'Seguimiento/GetSeguimientoFestivos?FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal}`;
    return await  this.comun.retorno_get(url);
  }

  GetHorarioLaboral = async (UsuarioId: number, FechaInicial: Date, FechaFinal: Date) => {
    let url = `${'Seguimiento/GetSeguimientoHorarioAgente?UsuarioId='+UsuarioId+'&FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal}`;
    return await  this.comun.retorno_get(url);
  }

  PutActualizarSeguimiento = async (data: any) => {
    let url = `${'Seguimiento/PutSeguimientotActualizacionFecha'}`;
    return await  this.comun.retorno_put(url, data);
  }

}
