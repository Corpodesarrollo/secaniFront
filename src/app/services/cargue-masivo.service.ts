import { Injectable } from '@angular/core';
import { Generico } from '../core/services/generico';
import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class CargueMasivoService {
  private urlbase: string = `${environment.url_MsNna}`;
  constructor(private generico: Generico) { }

  cargarArchivo(file: File) {
    const url: string = `CargarArchivoNNA`;
    return this.generico.retorno_post(url, file, true, this.urlbase);
  }
}
