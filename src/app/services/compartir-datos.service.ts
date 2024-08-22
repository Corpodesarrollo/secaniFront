import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompartirDatosService {

  constructor() { }

  private nuevoContactoEAPB = new Subject<any>();  // Observable para los nuevos datos
  nuevoContactoEAPB$ = this.nuevoContactoEAPB.asObservable();  // Observable expuesto para que los componentes se suscriban

  // Método para emitir un nuevo dato
  emitirNuevoContactoEAPB(nuevoContactoEAPB: any) {
    this.nuevoContactoEAPB.next(nuevoContactoEAPB);
  }
}
