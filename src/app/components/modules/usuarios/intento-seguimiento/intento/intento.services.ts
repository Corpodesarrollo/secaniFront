import { Injectable } from '@angular/core';
import { Generico } from '../../../../../core/services/generico';


@Injectable({
  providedIn: 'root'
})
export class IntentoService {
  constructor(private comun: Generico) {}




  PostIntento = async (data: any) => {
    let url = `${'Intento/PostIntento'}`;
    return await  this.comun.retorno_post(url, data);
  }

  GetTipoFallasLlamada = async () => {
    let url = `${'Intento/GetTiposFallas'}`;
    return await  this.comun.retorno_get(url);
  }

  GetSeguimientoNNA = async (NNAId: any) => {
    let url = `${'Seguimiento/SeguimientoNNA/'+NNAId}`;
    return await  this.comun.retorno_get(url);
  }




}
