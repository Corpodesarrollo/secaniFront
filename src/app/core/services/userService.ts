import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class User {
    id?: string;
    alias?: string;
    email?: string;
    name?: string;
    state?: boolean = false;
    rolCode?: string[];
    enterpriseCode?: string;
    enterpriseDeptoCode?: string;
    enterpriseEmail?: string;
    enterpriseName?: string;
    enterpriseIdentification?: string;
    isMinSalud?: string;
    isAuth?: boolean = false;

    constructor() {
        this.getData();
    }

    getData(){
        const usuarioJson = localStorage.getItem('user');
        if (usuarioJson) {
            const usuarioData = JSON.parse(usuarioJson);
            this.id = usuarioData.Id;
            this.alias = usuarioData.Alias;
            this.email = usuarioData.Email;
            this.name = usuarioData.Name;
            this.state = usuarioData.State;
            this.rolCode = usuarioData.RolCode;
            this.enterpriseCode = usuarioData.EnterpriseCode;
            this.enterpriseDeptoCode = usuarioData.EnterpriseDeptoCode;
            this.enterpriseEmail = usuarioData.EnterpriseEmail;
            this.enterpriseName = usuarioData.EnterpriseName;
            this.enterpriseIdentification = usuarioData.EnterpriseIdentification;
            this.isMinSalud = usuarioData.IsMinSalud;
            this.isAuth = usuarioData.IsAuth;
        }
    }
}