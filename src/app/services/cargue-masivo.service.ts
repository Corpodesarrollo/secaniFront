import { Injectable } from '@angular/core';
import { Generico } from '../core/services/generico';
import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class CargueMasivoService {
  private urlbase: string = `${environment.url_MsNna}`;
  constructor(private generico: Generico) { }

  cargarArchivo(file: File) {
    const url: string = `NNA/CargarArchivoNNA`;

    const formData = new FormData();
    formData.append('file', file);

    return this.generico.retorno_post_cargue_archivo(url, formData, true, this.urlbase);
  }
}
