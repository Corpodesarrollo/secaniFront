import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../core/services/userService';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ModuloGuard implements CanActivate {
    hasAccess: boolean = false;
    constructor(private user: UserService, private router: Router) {}

    async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
        if (this.hasAccess) { return true; }

        let jsonUsuario = {
            id: 'd54fc3db-060c-4bb3-aef2-d8b4e3e5f8c9',
            idRol: '311882D4-EAD0-4B0B-9C5D-4A434D49D16D',
            alias: 'CC3216549873',
            email: 'fermanjarres3@gmail.com',
            name: 'FERNANDO MANJARRES',
            state: true,
            rolCode: ['Perfil PISIS Neo','SINTRA-ENT','SECANI-CoordinadorAdmin'],
            enterpriseCode: 'CC 3216549873',
            enterpriseDeptoCode: '',
            enterpriseEmail: 'fermanjarres3@gmail.com',
            enterpriseName: 'TRES FERNANDO MANJARRES',
            enterpriseIdentification: '3216549873',
            isMinSalud: false,
            isCoordinadorAdmin: false,
            isAgenteSeguimiento: false, 
            isCuidador: true,
            isET: false,
            isEAPB: false
        };

        localStorage.setItem('user', JSON.stringify(jsonUsuario));

        if (environment.cookie) {
            try {
                const data = await this.user.get();

                if (data) {
                jsonUsuario = data;
                this.hasAccess = true;
                localStorage.setItem('user', JSON.stringify(jsonUsuario));
                console.log('✅ Usuario autenticado:', jsonUsuario);
                }
            } catch (error: any) {
                if (error.code === 401) {
                console.log('⛔ Usuario no autenticado, redirigiendo al login...');
                window.location.href = environment.url_Sispro;
                } else {
                console.error('⚠️ Otro error:', error);
                }
            }

            if (this.hasAccess) {
                console.log('✅ Acceso concedido');
                return true;
            }
        } else {
            console.log('✅ Acceso concedido por ModuloGuard (sin cookie)');
            return true;
        }

        console.log('⛔ Acceso denegado por ModuloGuard');
        return false;
    }
}