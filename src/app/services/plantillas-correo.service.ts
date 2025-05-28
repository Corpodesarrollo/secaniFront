import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { GenericService } from './generic.services';
import { EliminarPlantillaCorreo } from '../models/eliminarPlantillaCorreo.model';

@Injectable({
  providedIn: 'root'
})
export class PlantillasCorreoService {
  constructor(private generico: GenericService) { }

  crearEditarPlantillaCorreo(dato: any): Observable<Object> {
    const url: string = `seguimiento/CrearPlantillaCorreo`;
    return this.generico.post(url, dato, 'Seguimiento');
  }

  getPlantillasCorreo(): Observable<Object> {
    const url: string = `seguimiento/ConsultarPlantillaCorreo`;
    return this.generico.get(url, '', 'Seguimiento');
  }

  getHistorioPlantillaCorreo(id: string) {
    const url: string = `seguimiento/HistoricoPlantillaCorreo/${id}`;
    return this.generico.get('', url, 'Seguimiento');
  }

  getPlantillaCorreo(id: string) {
    const url: string = `seguimiento/ConsultarPlantillaCorreo/${id}`;
    return this.generico.get('', url, 'Seguimiento');
  }

  deletePlantillaCorreo(eliminar: EliminarPlantillaCorreo) {
    const url: string = `seguimiento/EliminarPlantillaCorreo`;
    return this.generico.post(url, eliminar, 'Seguimiento');
  }
}
