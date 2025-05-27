import { Injectable } from "@angular/core";
import { GenericService } from "../../services/generic.services";
import { apis } from "../../models/apis.model";
import { ContactoEAPB } from "../../models/contactoEapb.model";
import { EAPB } from "../../models/eapb.model";
import { Parametricas } from "../../models/parametricas.model";

@Injectable({
  providedIn: 'root'
})

export class EntidadServices{
    constructor(
        private repos: GenericService,
    ) { }

    public async getEAPB(): Promise<Parametricas[]>{
        let url = `EAPB`;
        return new Promise((resolve, reject) => {
            this.repos.get(url, ``, apis.tablaParametrica).subscribe({
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

    public async getET(): Promise<Parametricas[]>{
        let url = `ET`;
        return new Promise((resolve, reject) => {
            this.repos.get(url, ``, apis.tablaParametrica).subscribe({
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

    public async getEntidades(): Promise<Parametricas[]>{
        let url = `EAPB/Entidades`;
        return new Promise((resolve, reject) => {
            this.repos.get(url, ``, apis.tablaParametrica).subscribe({
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