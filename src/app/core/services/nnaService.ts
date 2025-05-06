import { apis } from "../../models/apis.model";
import { NNA } from "../../models/nna.model";
import { Parametricas } from "../../models/parametricas.model";
import { GenericService } from "../../services/generic.services";
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NNAService {
     constructor(
        private repos: GenericService,
    ) { }

    public async getByIdentificacion(tipoID: string, numeroIdentificacion: string): Promise<NNA | null>{
        let url = `NNA/ConsultarNNAsByTipoIdNumeroId/${tipoID}/${numeroIdentificacion}`;
        return new Promise((resolve, reject) => {
            this.repos.get(url, ``, apis.nna).subscribe({
                next: (data: any) => {
                resolve(data);
                },
                error: (err) => {
                console.error(err);
                resolve(null);
                }
            });
        });
    }

    public async putNNA(nna: NNA): Promise<Parametricas[]> {
        return new Promise((resolve, reject) => {
            this.repos.put('NNA/Actualizar', nna, 'NNA').subscribe({
                next: (data: any) => {
                resolve(data);
                },
                error: (err) => {
                console.error(err);
                reject(err);
                }
            });
        });
    }

    public async postNNA(nna: NNA): Promise<any> {
        return new Promise((resolve, reject) => {
            this.repos.post('NNA/crear', nna, 'NNA').subscribe({
                next: (data: any) => {
                    console.log(data);
                resolve(data);
                },
                error: (err) => {
                console.error(err);
                reject(err);
                }
            });
        });
    }
}