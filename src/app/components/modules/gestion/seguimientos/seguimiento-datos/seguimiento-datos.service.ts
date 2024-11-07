import { Injectable } from "@angular/core";
import { environment } from "../../../../../../environments/environment";
import { Generico } from "../../../../../core/services/generico";

@Injectable({
  providedIn: 'root',
})
export class SeguimientoDatosService {
  constructor(private axios: Generico) {
  }

  async getCntSeguimientoByNNA(id:number) {
    var urlbase: string = environment.url_MSSeguimiento;
    var url = `Seguimiento/GetCntSeguimientoByNNA/${id}`;
    return await this.axios.retorno_get(url, urlbase);
  }
}