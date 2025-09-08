import { Injectable } from "@angular/core";
import { apis } from "../../models/apis.model";
import { GenericService } from "../../services/generic.services";

@Injectable({
  providedIn: 'root',
})
export class UserService {

    constructor(
        private repos: GenericService,
    )  {
    }
    
    public async get(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.repos.get('auth', '', apis.authentication).subscribe({
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