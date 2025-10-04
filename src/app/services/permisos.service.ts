import { Injectable } from "@angular/core";
import { Observable, of, tap } from "rxjs";

import { GenericService } from "./generic.services";

@Injectable({
    providedIn: 'root'
})
export class PermisosService {
    private permisosCache: any = {};

    constructor(private generico: GenericService) { }

    getPermisos(path: string): Observable<any> {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const roleId = user?.idRol;

        console.log("****** permisos service ******");
        console.log({ user, roleId });

        if (!roleId) {
            console.error('RoleId no encontrado en el usuario.');
            return of({});
        }

        const key = `${path}-${roleId}`;

        if (this.permisosCache[key]) {
            return of(this.permisosCache[key]);
        }

        return this.generico.get(`permisos/cansbypathandroleid/${path}/${roleId}`, "", "Entidad")
            .pipe(
                tap(permisos => {
                    this.permisosCache[key] = permisos;
                })
            );
    }
}

