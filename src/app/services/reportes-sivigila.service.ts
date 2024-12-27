import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { Generico } from '../core/services/generico';

@Injectable({
  providedIn: 'root'
})
export class ReportesSIVIGILAService {
  private urlbase: string = `${environment.url_MsNna}`;

  constructor(private generico: Generico) { }

  getReportes() {
    const url: string = `ReportesSIVIGILA`;
    return this.generico.retorno_get(url, this.urlbase);
  }

  postReporte(reporte: any) {
    const url: string = `ReportesSIVIGILA`;
    return this.generico.retorno_post(url, reporte, true, this.urlbase);
  }
}
