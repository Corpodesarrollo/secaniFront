import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteDinamicoAlertasComponent } from './reporte-dinamico-alertas.component';

describe('ReporteDinamicoAlertasComponent', () => {
  let component: ReporteDinamicoAlertasComponent;
  let fixture: ComponentFixture<ReporteDinamicoAlertasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteDinamicoAlertasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteDinamicoAlertasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
