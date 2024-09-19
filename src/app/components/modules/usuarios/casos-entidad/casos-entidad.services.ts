import { Injectable } from '@angular/core';
import { Generico } from '../../../../core/services/generico';



@Injectable({
  providedIn: 'root'
})
export class CasosEntidadService {
  constructor(private comun: Generico) {}


  GetEstadoAlerta = async () => {
    let url = `${'EstadoAlerta'}`;
    return await  this.comun.retorno_get_parametrica(url);
  }

  GetEstadoSeguimiento = async () => {
    let url = `${'EstadoSeguimiento'}`;
    return await  this.comun.retorno_get_parametrica(url);
  }

  GetListaCasos = async (eapbId: number, epsId: number) => {
    let url = `${'Notificacion/GetListaCasosNotificacion?eapbId='+eapbId+'&epsId='+epsId}`;
    return await  this.comun.retorno_get(url);
  }


}
