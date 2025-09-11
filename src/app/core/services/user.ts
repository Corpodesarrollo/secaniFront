import { Injectable } from "@angular/core";
import { apis } from "../../models/apis.model";
import { GenericService } from "../../services/generic.services";

@Injectable({
  providedIn: 'root',
})
export class User {
    id?: string;
    idRol?: string;
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
    isCoordinadorAdmin?: boolean = false;
    isAgenteSeguimiento?: boolean = false;
    isCuidador?: boolean = false;
    isET?: boolean = false;
    isEAPB?: boolean = false;


    constructor(  )  {
        this.getData();
    }
    
    getData(){
        const usuarioJson = localStorage.getItem('user');
        if (usuarioJson) {
            const usuarioData = JSON.parse(usuarioJson);
            this.id = usuarioData.id;
            this.idRol = usuarioData.idRol;
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
            this.isCoordinadorAdmin = usuarioData.isCoordinadorAdmin
            this.isAgenteSeguimiento = usuarioData.isAgenteSeguimiento
            this.isCuidador = usuarioData.isCuidador
            this.isET = usuarioData.isET
            this.isEAPB = usuarioData.isEAPB
        }
    }
}