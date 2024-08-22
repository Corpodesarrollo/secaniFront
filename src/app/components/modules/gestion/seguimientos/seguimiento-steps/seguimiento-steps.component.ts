import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-seguimiento-steps',
  standalone: true,
  imports: [StepsModule],
  templateUrl: './seguimiento-steps.component.html',
  styleUrl: './seguimiento-steps.component.css'
})
export class SeguimientoStepsComponent implements OnChanges {
  @Input() stepsCount: number = 0;
  @Input() activeIndex: number = 0;
  @Output() activeIndexChange = new EventEmitter<number>();

  itemsStep: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stepsCount']) {
      this.generateSteps();
    }
  }

  generateSteps(): void {
    this.itemsStep = [];
    for (let i = 0; i < this.stepsCount; i++) {
      this.itemsStep.push({});
    }
  }

  onActiveIndexChange(event: number): void {
    this.activeIndexChange.emit(event);
  }
}
