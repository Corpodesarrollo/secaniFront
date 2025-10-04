import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermisosService } from '../services/permisos.service';
import { catchError, map, of } from 'rxjs';

export const permisoGuard: CanActivateFn = (route, state) => {
  console.log("****** permisoGuard ******")
  const permisosService = inject(PermisosService);
  const router = inject(Router);

  const path = route.data['path'];
  const permiso: string = route.data['permiso'] || 'canView';

  return permisosService.getPermisos(path).pipe(
    map(permisos => {
      console.log("****** permisos ******");
      console.log(permisos);
      
      if (permisos?.[permiso]) {
        return true;
      } else {
        return router.createUrlTree(['/']);
      }
    }),
    catchError(() => {
      return of(router.createUrlTree(['/']));
    })
  );
};
