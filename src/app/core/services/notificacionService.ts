import { Injectable } from "@angular/core";
import { GenericService } from "../../services/generic.services";
import { apis } from "../../models/apis.model";
import { Oficio } from "../../models/oficio.model";
import { notificacionOficio } from "../../models/notificacionOficio.model";
import { Respuesta } from "../../models/respuesta.model";

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
     constructor(
        private repos: GenericService,
    ) { }

    public async getOficio(id: number): Promise<Respuesta> {
        return new Promise((resolve, reject) => {
            this.repos.get(`Notificacion/VerOficioNotificacion/${id}`, '', apis.seguimiento).subscribe({
                next: (data: any) => {
                    console.log(data);
                resolve(data);
                },
                error: (err) => {
                    console.error(err);
                    reject(err);
                }
            });
        });
    }

    public async postOficio(oficio: Oficio): Promise<Respuesta> {
        return new Promise((resolve, reject) => {
            this.repos.post('Notificacion/OficioNotificacion', oficio, apis.seguimiento).subscribe({
                next: (data: any) => {
                    console.log(data);
                resolve(data);
                },
                error: (err) => {
                console.error(err);
                reject(err);
                }
            });
        });
    }

    public async postEnviarOficio(notificacion: notificacionOficio): Promise<Respuesta> {
        return new Promise((resolve, reject) => {
            this.repos.post('Notificacion/EnviarOficioNotificacion', notificacion, apis.seguimiento).subscribe({
                next: (data: any) => {
                    console.log(data);
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