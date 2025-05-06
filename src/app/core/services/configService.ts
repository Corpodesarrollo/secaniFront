import { Injectable } from "@angular/core";
import { GenericService } from "../../services/generic.services";
import { apis } from "../../models/apis.model";
import { Config } from "../../models/config.model";

@Injectable({
  providedIn: 'root'
})

export class ConfigService{
    constructor(
        private repos: GenericService,
    ) { }

    public async get(): Promise<Config>{
        let url = `EmailConfiguration`;
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
}