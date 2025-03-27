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
    return result ?? false; // Si es undefined, devolvemos false
  } catch (error) {
    return false; // En caso de error, prevenir la navegación
  }
};
