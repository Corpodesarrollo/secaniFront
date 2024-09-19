import { Injectable } from '@angular/core';
import { Generico } from '../../../../../core/services/generico';


@Injectable({
  providedIn: 'root'
})
export class IntentoExitosoService {
  constructor(private comun: Generico) {}


  PostIntento = async (data: any) => {
    let url = `${'Intento/PostIntento'}`;
    return await  this.comun.retorno_post(url, data);
  }

  PutActualizarSeguimiento = async (data: any) => {
    let url = `${'Seguimiento/PutSeguimientotActualizacionFecha'}`;
    return await  this.comun.retorno_put(url, data);
  }

  GetNNaById = async (Id: number) => {
    let url = `${'Seguimiento/NNA/'+Id}`;
    return await  this.comun.retorno_get(url);
  }

  PutActualizarSeguimientoRechazo= async (data: any) => {
    let url = `${'Seguimiento/PutSeguimientoRechazo'}`;
    return await  this.comun.retorno_put(url, data);
  }
}
