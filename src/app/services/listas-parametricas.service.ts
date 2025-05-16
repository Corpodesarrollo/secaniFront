import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { GenericService } from './generic.services';
import { ListaParametrica } from '../models/listaParametrica.model';

@Injectable({
  providedIn: 'root'
})
export class ListasParametricasService {
  constructor(private generico: GenericService) { }

  getListasParametricas(): Observable<Object> {
    const url: string = `NombresTablaParametrica`;
    return this.generico.get(url, '', 'TablaParametrica');
  }

  getListaParametrica(id: string): Observable<Object> {
    const url: string = `NombresTablaParametrica/${id}`;
    return this.generico.get(url, '', 'TablaParametrica');
  }

  getListaParametricaPadreId(padreId: string): Observable<Object>{
    const url: string = `NombresTablaParametrica/padre/${padreId}`;
    return this.generico.get(url, '', 'TablaParametrica');
  }

  putListaParametrica(id: string, listaParametrica: ListaParametrica): Observable<Object> {
    const url: string = `NombresTablaParametrica/${id}`;
    return this.generico.put(url, listaParametrica, 'TablaParametrica');
  }

  /* Editar Item de lista parametrica */
  putItemListaParametrica(nombre: string, id: string, dato: any): Observable<Object> {
    const url: string = `${nombre}/${id}`;
    return this.generico.put(url, dato, 'TablaParametrica');
  }

  /* Agregar Item de lista parametrica */
  postItemListaParametrica(nombre: string, dato: any): Observable<Object> {
    const url: string = `${nombre}`;
    return this.generico.post(url, dato, 'TablaParametrica');;
  }

  getItemListaParametricas(nombre: string): Observable<Object> {
    const url: string = `ApiTablasParametricas/${nombre}`;
    return this.generico.get(url, '', 'TablaParametrica');;
  }

  getHistoricoListaParametrica(nombre: string): Observable<Object> {
    const url: string = `api/HistoricoTransaccion/tabla/${nombre}`;
    return this.generico.get(url, '', 'TablaParametrica');
  }
  
  deleteItemListaParametrica(id: string): Observable<Object> {
    const url: string = `NombreTablaParametrica/${id}`;
    return this.generico.get(url, '', 'TablaParametrica');
  }
}
