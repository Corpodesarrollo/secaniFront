import { Injectable } from '@angular/core';
import { Generico } from '../../../../core/services/generico';
import { environment } from '../../../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class IntentoSeguimientoService {
  constructor(private comun: Generico) {}

  GetSeguimientoById = async (Id: number) => {
    let url = `${'Seguimiento/'+Id}`;
    return await  this.comun.retorno_get(url);
  }

  // BUG-LZ-046: antes apuntaba a `Seguimiento/NNA/{id}` en MSSeguimiento (9113), donde el
  // routing matcheaba `[HttpGet("{id}")]` con id="NNA" y devolvia el primer NNA (Juan Carlos
  // Pérez García) consistentemente, sin importar el id real. El endpoint correcto es
  // `NNA/{id}` en MSNNA (9112).
  GetNNaById = async (Id: number) => {
    let url = `NNA/${Id}`;
    return await this.comun.retorno_get(url, environment.url_MsNna);
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
