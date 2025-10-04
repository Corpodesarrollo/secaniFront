import { Injectable } from "@angular/core";
import { Observable, of, tap } from "rxjs";

import { GenericService } from "./generic.services";

@Injectable({
    providedIn: 'root'
})
export class PermisosService {
    private permisosCache: Record<string, { data: any; timestamp: number }> = {};
    private TTL = 3 * 60 * 1000; // 3 minutos

    constructor(private generico: GenericService) { }

    getPermisos(path: string): Observable<any> {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const roleId = user?.idRol;
        const key = `${path}-${roleId}`;
        const cacheEntry = this.permisosCache[key];

        if (cacheEntry && Date.now() - cacheEntry.timestamp < this.TTL) {
            return of(cacheEntry.data);
        }

        return this.generico
            .get(`permisos/cansbypathandroleid/${encodeURIComponent(path)}/${roleId}`, "", "Entidad")
            .pipe(
                tap(permisos => {
                    this.permisosCache[key] = { data: permisos, timestamp: Date.now() };
                })
            );
    }

}

