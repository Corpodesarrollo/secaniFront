import { Injectable } from '@angular/core';
import { Generico } from '../core/services/generico';
import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class ListasParametricasService {
  private urlbase: string = `${environment.url_MSTablasParametricas}`;
  constructor(private generico: Generico) { }

  getListasParametricas(): Promise<any[]> {
    const url: string = `NombresTablaParametrica`;
    return this.generico.retorno_get(url, this.urlbase);
  }

  getListaParametrica(id: string) {
    const url: string = `NombresTablaParametrica/${id}`;
    return this.generico.retorno_get(url, this.urlbase);
  }

  getListaParametricaPadreId(padreId: string) {
    const url: string = `NombresTablaParametrica/padre/${padreId}`;
    return this.generico.retorno_get(url, this.urlbase);
  }

  putListaParametrica(id: string, descripcion: any) {
    const url: string = `NombresTablaParametrica/${id}`;
    return this.generico.retorno_put_parametrica(url, descripcion);
  }

  /* Editar Item de lista parametrica */
  putItemListaParametrica(nombre: string, id: string, dato: any) {
    const url: string = `${nombre}/${id}`;
    return this.generico.retorno_put_parametrica(url, dato);
  }

  /* Agregar Item de lista parametrica */
  postItemListaParametrica(nombre: string, dato: any) {
    const url: string = `${nombre}`;
    return this.generico.retorno_post(url, dato, true, this.urlbase);
  }

  getItemListaParametricas(nombre: string) {
    const url: string = `ApiTablasParametricas/${nombre}`;
    return this.generico.retorno_get_parametrica(url);
  }
}
