import { inject } from '@angular/core';
import { CanDeactivateFn, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { firstValueFrom } from 'rxjs';

import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

export const confirmExitGuard: CanDeactivateFn<any> = async(component, currentRoute, currentState, nextState) => {
  const router = inject(Router);

  // Leer el estado de la navegación
  const navigation = router.getCurrentNavigation();
  const skipGuard = navigation?.extras?.state?.['skipGuard'];
  
  // Salta el guard si viene con { state: { skipGuard: true } }
  if (skipGuard || component.submitted2) return true;

  try {
    const dialogService = inject(DialogService);
    // Mostrar modal de confirmación
    const ref = dialogService.open(ConfirmDialogComponent, {
      modal: true,
      width: '500px',
      closable: false,
    });

    const result = await firstValueFrom(ref.onClose, { defaultValue: false });
    if (!result) return false; // El usuario no confirmó
      
    // Si el usuario confirmó ("Sí"), ejecutamos abrirGuardarYReagendar
    component.abrirGuardarYReagendar?.();
    return false;
  } catch (error) {
    return false; // En caso de error, prevenir la navegación
  }
};
