import { Injectable } from '@angular/core';
import { Generico } from '../core/services/generico';
import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class PlantillasCorreoService {
  private urlbase: string = `${environment.url_MSSeguimiento}`;
  constructor(private generico: Generico) { }

  crearEditarPlantillaCorreo(data: any) {
    const url: string = `Notificacion/OficioNotificacion`;
    return this.generico.retorno_post(url, data, true, this.urlbase);
  }
}
