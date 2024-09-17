import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoGestionarComponent } from './seguimiento-gestionar.component';

describe('SeguimientoGestionarComponent', () => {
  let component: SeguimientoGestionarComponent;
  let fixture: ComponentFixture<SeguimientoGestionarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguimientoGestionarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoGestionarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
