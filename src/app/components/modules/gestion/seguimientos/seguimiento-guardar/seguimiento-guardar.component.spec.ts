import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoGuardarComponent } from './seguimiento-guardar.component';

describe('SeguimientoGuardarComponent', () => {
  let component: SeguimientoGuardarComponent;
  let fixture: ComponentFixture<SeguimientoGuardarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguimientoGuardarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoGuardarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
