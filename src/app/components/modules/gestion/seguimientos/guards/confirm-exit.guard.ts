import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';

import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { firstValueFrom, Observable } from 'rxjs';

export const confirmExitGuard: CanDeactivateFn<any> = async(component, currentRoute, currentState, nextState) => {
  if (component.submitted2) return true;

  const dialogService = inject(DialogService);

  // Mostrar modal de confirmación
  const ref = dialogService.open(ConfirmDialogComponent, {
    modal: true,
    width: '500px',
    closable: false,
  });

  try {
    const result = await firstValueFrom(ref.onClose, { defaultValue: false });
    if (result) {
      // Si el usuario confirmó ("Sí"), ejecutamos Guardar
      if (component.Guardar && typeof component.Guardar === 'function') {
        await component.Guardar(); // Esperamos que termine de guardar
      }
      return true; // Ahora sí permitimos salir
    } else {
      return false; // El usuario dijo "No", se queda en la página
    }
    
    return result ?? false; // Si es undefined, devolvemos false
  } catch (error) {
    return false; // En caso de error, prevenir la navegación
  }
};
