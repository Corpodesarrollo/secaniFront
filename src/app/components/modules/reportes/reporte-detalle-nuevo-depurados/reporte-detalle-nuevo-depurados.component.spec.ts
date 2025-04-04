import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteDetalleNuevoDepuradosComponent } from './reporte-detalle-nuevo-depurados.component';

describe('ReporteDetalleNuevoDepuradosComponent', () => {
  let component: ReporteDetalleNuevoDepuradosComponent;
  let fixture: ComponentFixture<ReporteDetalleNuevoDepuradosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteDetalleNuevoDepuradosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteDetalleNuevoDepuradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
