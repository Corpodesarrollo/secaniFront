import { Injectable } from '@angular/core';

import { Generico } from '../core/services/generico';
import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class PlantillasCorreoService {
  private urlbase: string = `${environment.url_MSSeguimiento}`;
  constructor(private generico: Generico) { }

  crearEditarPlantillaCorreo(data: any) {
    const url: string = `CrearPlantillaCorreo`;
    return this.generico.retorno_post(url, data, true, this.urlbase);
  }

  obtenerPlantillasCorreo() {
    const url: string = `ConsultarPlantillaCorreo`;
    return this.generico.retorno_get(url, this.urlbase);
  }

  historioPlantillaCorreo(id: string) {
    const url: string = `HistoricoPlantillaCorreo/${id}`;
    return this.generico.retorno_get(url, this.urlbase);
  }

  obtnenerPlantillaCorreoPorId(id: string) {
    const url: string = `ConsultarPlantillaCorreo/${id}`;
    return this.generico.retorno_get(url, this.urlbase);
  }

  eliminarPlantillaCorreo(id: string) {
    const url: string = `EliminarPlantillaCorreo/${id}`;
    return this.generico.retorno_delete_custom(url, this.urlbase);
  }
}
