import { Injectable } from "@angular/core";
import { GenericService } from "../../services/generic.services";
import { Parametricas } from "../../models/parametricas.model";
import { Persona } from "../../models/persona.model";
import { NNA } from '../../models/nna.model';
import { apis } from "../../models/apis.model";

@Injectable({
  providedIn: 'root'
})

export class PersonaService{
    constructor(
        private repos: GenericService,
    ) { }

    public async get(tipoID: string, numeroIdentificacion: string, fechaExpedicion: Date | null = null): Promise<Persona | null>{
        let url = fechaExpedicion == null ? `Persona/GetIdVigente/${tipoID}/${numeroIdentificacion}` : `Persona/GetIdVigente/${tipoID}/${numeroIdentificacion}/${fechaExpedicion}`;
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
    
    public async getAll(tipoID: string, numeroIdentificacion: string, fechaExpedicion: Date | null = null): Promise<Persona[]>{
        let url = fechaExpedicion == null ? `Persona/GetId/${tipoID}/${numeroIdentificacion}` : `Persona/GetId/${tipoID}/${numeroIdentificacion}/${fechaExpedicion}`;
        return new Promise((resolve, reject) => {
            this.repos.get(url, ``, apis.nna).subscribe({
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