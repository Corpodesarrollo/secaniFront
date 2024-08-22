import { Injectable } from '@angular/core';
import { Generico } from '../../../../core/services/generico';



@Injectable({
  providedIn: 'root'
})
export class IntentoSeguimientoService {
  constructor(private comun: Generico) {}

  GetSeguimientoById = async (Id: number) => {
    let url = `${'Seguimiento/'+Id}`;
    return await  this.comun.retorno_get(url);
  }

  GetNNaById = async (Id: number) => {
    let url = `${'Seguimiento/NNA/'+Id}`;
    return await  this.comun.retorno_get(url);
  }

  GetIntentoContactoAgrupado = async (Id: number) => {
    let url = `${'Intento/GetIntentoContactoAgrupado?NNAId='+Id}`;
    return await  this.comun.retorno_get(url);
  }

  GetIntentosContactoNNA = async (Id: number) => {
    let url = `${'Intento/GetIntentosContactoNNA?NNAId='+Id}`;
    return await  this.comun.retorno_get(url);
  }

}
