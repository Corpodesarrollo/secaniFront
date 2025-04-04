import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteDinamicoNnaComponent } from './reporte-dinamico-nna.component';

describe('ReporteDinamicoNnaComponent', () => {
  let component: ReporteDinamicoNnaComponent;
  let fixture: ComponentFixture<ReporteDinamicoNnaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteDinamicoNnaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteDinamicoNnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
