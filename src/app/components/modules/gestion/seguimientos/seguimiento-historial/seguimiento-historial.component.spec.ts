import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoHistorialComponent } from './seguimiento-historial.component';

describe('SeguimientoHistorialComponent', () => {
  let component: SeguimientoHistorialComponent;
  let fixture: ComponentFixture<SeguimientoHistorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguimientoHistorialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoHistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
