import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoStepsComponent } from './seguimiento-steps.component';

describe('SeguimientoStepsComponent', () => {
  let component: SeguimientoStepsComponent;
  let fixture: ComponentFixture<SeguimientoStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguimientoStepsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
