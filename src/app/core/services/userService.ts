import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class User {
    static id?: string;
    static alias?: string;
    static email?: string;
    static name?: string;
    static state?: boolean = false;
    static rolCode?: string[];
    static enterpriseCode?: string;
    static enterpriseDeptoCode?: string;
    static enterpriseEmail?: string;
    static enterpriseName?: string;
    static enterpriseIdentification?: string;
    static isMinSalud?: string;
    static isAuth?: boolean = false;

    constructor() {
        this.getData();
    }

    getData(){
        const usuarioJson = localStorage.getItem('user');
        if (usuarioJson) {
            const usuarioData = JSON.parse(usuarioJson);
            User.id = usuarioData.Id;
            User.alias = usuarioData.Alias;
            User.email = usuarioData.Email;
            User.name = usuarioData.Name;
            User.state = usuarioData.State;
            User.rolCode = usuarioData.RolCode;
            User.enterpriseCode = usuarioData.EnterpriseCode;
            User.enterpriseDeptoCode = usuarioData.EnterpriseDeptoCode;
            User.enterpriseEmail = usuarioData.EnterpriseEmail;
            User.enterpriseName = usuarioData.EnterpriseName;
            User.enterpriseIdentification = usuarioData.EnterpriseIdentification;
            User.isMinSalud = usuarioData.IsMinSalud;
            User.isAuth = usuarioData.IsAuth;
        }
    }
}

export const user = {
    id: User.id,
    alias: User.alias,
    email: User.email,
    name: User.name,
    state: User.state,
    rolCode: User.rolCode,
    enterpriseCode: User.enterpriseCode,
    enterpriseDeptoCode: User.enterpriseDeptoCode,
    enterpriseEmail: User.enterpriseEmail,
    enterpriseName: User.enterpriseName,
    enterpriseIdentification: User.enterpriseIdentification,
    isMinSalud: User.isMinSalud,
    isAuth: User.isAuth
}