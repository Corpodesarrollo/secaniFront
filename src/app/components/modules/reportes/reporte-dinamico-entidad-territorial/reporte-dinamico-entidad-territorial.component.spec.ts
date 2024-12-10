import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteDinamicoEntidadTerritorialComponent } from './reporte-dinamico-entidad-territorial.component';

describe('ReporteDinamicoEntidadTerritorialComponent', () => {
  let component: ReporteDinamicoEntidadTerritorialComponent;
  let fixture: ComponentFixture<ReporteDinamicoEntidadTerritorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteDinamicoEntidadTerritorialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteDinamicoEntidadTerritorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
