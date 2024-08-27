import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoSinTratamientoComponent } from './seguimiento-sin-tratamiento.component';

describe('SeguimientoSinTratamientoComponent', () => {
  let component: SeguimientoSinTratamientoComponent;
  let fixture: ComponentFixture<SeguimientoSinTratamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguimientoSinTratamientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoSinTratamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
