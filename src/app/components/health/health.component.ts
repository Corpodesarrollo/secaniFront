import { Component } from '@angular/core';

@Component({
  selector: 'app-health',
  template: `{{ '{' }}"status": "Frontend funcionando correctamente", "version": "1.0.0"{{ '}' }}`,
  styles: []
})
export class HealthComponent {}