import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteDepuracionComponent } from './reporte-depuracion.component';

describe('ReporteDepuracionComponent', () => {
  let component: ReporteDepuracionComponent;
  let fixture: ComponentFixture<ReporteDepuracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteDepuracionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteDepuracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
