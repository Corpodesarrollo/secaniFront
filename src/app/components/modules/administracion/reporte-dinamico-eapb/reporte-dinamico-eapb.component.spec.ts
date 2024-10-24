import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteDinamicoEapbComponent } from './reporte-dinamico-eapb.component';

describe('ReporteDinamicoEapbComponent', () => {
  let component: ReporteDinamicoEapbComponent;
  let fixture: ComponentFixture<ReporteDinamicoEapbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteDinamicoEapbComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteDinamicoEapbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
