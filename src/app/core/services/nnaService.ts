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
}