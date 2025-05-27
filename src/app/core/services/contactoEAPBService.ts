import { Injectable } from "@angular/core";
import { GenericService } from "../../services/generic.services";
import { apis } from "../../models/apis.model";
import { ContactoEAPB } from "../../models/contactoEapb.model";

@Injectable({
  providedIn: 'root'
})

export class ContactoEAPBService{
    constructor(
        private repos: GenericService,
    ) { }

    public async getAll(): Promise<ContactoEAPB[]>{
        let url = `ContactoEntidad`;
        return new Promise((resolve, reject) => {
            this.repos.get(url, ``, apis.authentication).subscribe({
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

    public async getByEntidades(id: string): Promise<ContactoEAPB[]>{
        let url = `ContactoEntidad/Entidades`;
        return new Promise((resolve, reject) => {
            this.repos.get(url, `/${id}`, apis.authentication).subscribe({
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