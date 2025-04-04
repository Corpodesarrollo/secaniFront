import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompartirDatosService {

  constructor() { }

  private nuevoContactoEAPB = new Subject<any>();
  nuevoContactoEAPB$ = this.nuevoContactoEAPB.asObservable();

  private listaContactos = new Subject<any[]>();
  listaContactos$ = this.listaContactos.asObservable();

  // Método para emitir un nuevo dato
  emitirNuevoContactoEAPB(nuevoContactoEAPB: any) {
    this.nuevoContactoEAPB.next(nuevoContactoEAPB);
  }

  actualizarListaContactos(nuevaLista: any[]) {
    this.listaContactos.next(nuevaLista);
  }
}
