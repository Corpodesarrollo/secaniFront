import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompartirDatosService {

  constructor() { }

  // BUG-LZ-045 (extension): Subject simple perdia el emit cuando el modal (hijo) creaba/editaba
  // antes que el padre tuviera subscripcion lista (e.g. tras hot reload o cuando la tabla aun
  // estaba en carga inicial). ReplaySubject(1) entrega el ultimo emit a los subscribers tardios.
  private nuevoContactoEAPB = new ReplaySubject<any>(1);
  nuevoContactoEAPB$ = this.nuevoContactoEAPB.asObservable();

  private listaContactos = new ReplaySubject<any[]>(1);
  listaContactos$ = this.listaContactos.asObservable();

  emitirNuevoContactoEAPB(nuevoContactoEAPB: any) {
    this.nuevoContactoEAPB.next(nuevoContactoEAPB);
  }

  actualizarListaContactos(nuevaLista: any[]) {
    this.listaContactos.next(nuevaLista);
  }
}
