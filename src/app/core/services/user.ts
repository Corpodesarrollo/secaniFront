import { Injectable } from "@angular/core";
import { apis } from "../../models/apis.model";
import { GenericService } from "../../services/generic.services";

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


    constructor(  )  {
        this.getData();
    }
    
    getData(){
        const usuarioJson = localStorage.getItem('user');
        if (usuarioJson) {
            const usuarioData = JSON.parse(usuarioJson);
            this.id = usuarioData.id;
            this.alias = usuarioData.alias;
            this.email = usuarioData.email;
            this.name = usuarioData.name;
            this.state = usuarioData.state;
            this.rolCode = usuarioData.rolCode;
            this.enterpriseCode = usuarioData.enterpriseCode;
            this.enterpriseDeptoCode = usuarioData.enterpriseDeptoCode;
            this.enterpriseEmail = usuarioData.enterpriseEmail;
            this.enterpriseName = usuarioData.enterpriseName;
            this.enterpriseIdentification = usuarioData.enterpriseIdentification;
            this.isMinSalud = usuarioData.isMinSalud;
            this.isAuth = usuarioData.isAuth;
        }
    }
}