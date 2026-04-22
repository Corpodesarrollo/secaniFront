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

        // Si no hay user en localStorage, redirigir a selector QA
        const existingUser = localStorage.getItem('user');
        if (!existingUser) {
            this.router.navigate(['/qa-login']);
            return false;
        }

        let jsonUsuario = JSON.parse(existingUser);

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
