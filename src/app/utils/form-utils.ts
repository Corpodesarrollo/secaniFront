import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

export class FormUtils {
  static validarFechas(fieldFechaIncio: string, fieldFechaFin: string): ValidationErrors | null {
    return (group: AbstractControl) => {
      const formGroup = group as FormGroup;
      const inicio = formGroup.get(fieldFechaIncio)?.value;
      const fin = formGroup.get(fieldFechaFin)?.value;

      // Si alguna fecha no está, no validamos todavía
      if (!inicio || !fin) return null;

      const fechaInicio = new Date(inicio);
      const fechaFin = new Date(fin);
      const hoy = new Date();

      // Acumulamos errores
      const errors: ValidationErrors = {};

      if (fechaFin < fechaInicio) {
        errors['fechasInvalidas'] = 'La fecha fin debe ser mayor o igual a la fecha inicio';
      }

      if (fechaFin > hoy) {
        errors['fechaFutura'] = 'La fecha fin no puede ser mayor a la fecha actual';
      }

      return Object.keys(errors).length ? errors : null;
    }
  }
}
