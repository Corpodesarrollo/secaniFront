import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteDinamicoSeguimientoComponent } from './reporte-dinamico-seguimiento.component';

describe('ReporteDinamicoSeguimientoComponent', () => {
  let component: ReporteDinamicoSeguimientoComponent;
  let fixture: ComponentFixture<ReporteDinamicoSeguimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteDinamicoSeguimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteDinamicoSeguimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
