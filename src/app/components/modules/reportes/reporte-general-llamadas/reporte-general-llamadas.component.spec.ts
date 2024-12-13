import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteGeneralLlamadasComponent } from './reporte-general-llamadas.component';

describe('ReporteGeneralLlamadasComponent', () => {
  let component: ReporteGeneralLlamadasComponent;
  let fixture: ComponentFixture<ReporteGeneralLlamadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteGeneralLlamadasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteGeneralLlamadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
