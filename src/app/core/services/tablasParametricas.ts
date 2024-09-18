import { Parametricas } from "../../models/parametricas.model";
import { GenericService } from "../../services/generic.services";
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // Esto lo registra como un proveedor de raíz
})
export class TablasParametricas {
    tabla: Parametricas[] = [];

     constructor(
        private repos: GenericService,
    ) { }

    public async getTP(tabla: string): Promise<Parametricas[]> {
        return new Promise((resolve, reject) => {
            this.repos.get('TablaParametrica/', `${tabla}`, 'TablaParametrica').subscribe({
                next: (data: any) => {
                    this.tabla = data;
                    resolve(this.tabla);
                },
                error: (err) => {
                    console.error(err);
                    reject(err);
                }
            });
        });
    }
}