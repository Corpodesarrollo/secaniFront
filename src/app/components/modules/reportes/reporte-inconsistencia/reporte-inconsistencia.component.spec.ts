import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInconsistenciaComponent } from './reporte-inconsistencia.component';

describe('ReporteInconsistenciaComponent', () => {
  let component: ReporteInconsistenciaComponent;
  let fixture: ComponentFixture<ReporteInconsistenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteInconsistenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteInconsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
