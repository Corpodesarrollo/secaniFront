import { Injectable } from '@angular/core';
import { Generico } from '../core/services/generico';

@Injectable({providedIn: 'root'})
export class ListasParametricasService {
  private urlbase: string = 'https://mstablasparametricas-bdf0a9cza5bucwby.eastus2-01.azurewebsites.net';
  constructor(private generico: Generico) { }

  getListasParametricas(): Promise<any[]> {
    const url: string = `/NombresTablaParametrica`;
    return this.generico.retorno_get(url, this.urlbase);
  }

  putListaParametrica(id: string, listaParametricas: any) {
    const url: string = `/NombresTablaParametrica/${id}`;
    return this.generico.retorno_put(url, listaParametricas);
  }
}
