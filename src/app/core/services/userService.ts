import { Injectable } from "@angular/core";
import { apis } from "../../models/apis.model";
import { GenericService } from "../../services/generic.services";
import { HttpErrorResponse } from "@angular/common/http";

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
            error: (error: HttpErrorResponse) => {
                console.error('❌ Error capturado:');
                console.error('Status:', error.status);
                console.error('Mensaje:', error.message);
                console.error('URL:', error.url);

                // 🔹 Detectar error de autenticación
                if (error.status === 401) {
                console.warn('⚠️ No se pudo autenticar el usuario (401 Unauthorized)');
                reject({ message: 'No autorizado', code: 401 });
                } else {
                // Otros errores (500, 404, etc.)
                reject(error);
                }
            }
            });
        });
    }
}