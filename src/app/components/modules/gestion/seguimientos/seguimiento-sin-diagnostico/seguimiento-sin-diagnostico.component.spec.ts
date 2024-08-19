import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoSinDiagnosticoComponent } from './seguimiento-sin-diagnostico.component';

describe('SeguimientoSinDiagnosticoComponent', () => {
  let component: SeguimientoSinDiagnosticoComponent;
  let fixture: ComponentFixture<SeguimientoSinDiagnosticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguimientoSinDiagnosticoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoSinDiagnosticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
