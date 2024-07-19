import { Injectable } from '@angular/core';
import { Generico } from '../../core/services/generico';


@Injectable({
  providedIn: 'root'
})
export class MiSemanaService {
  constructor(private comun: Generico) {}

  GetDummy = async () => {
    let url = `${'WeatherForecast'}`;
    return await  this.comun.retorno_get(url);
  }

  GetSeguimientoUsuario = async (UsuarioId: number, FechaInicial: Date, FechaFinal: Date) => {
    let url = `${'Seguimiento/GetSeguimientoUsuario?UsuarioId='+UsuarioId+'+&FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal}`;
    return await  this.comun.retorno_get(url);
  }

  GetFestivos = async (FechaInicial: Date, FechaFinal: Date) => {
    let url = `${'Seguimiento/GetSeguimientoFestivos?FechaInicial='+FechaInicial+'&FechaFinal='+FechaFinal}`;
    return await  this.comun.retorno_get(url);
  }

  GetHorarioLaboral = async (UsuarioId: number) => {
    let url = `${'Seguimiento/GetSeguimientoUsuario?UsuarioId='+UsuarioId}`;
    return await  this.comun.retorno_get(url);
  }


}
