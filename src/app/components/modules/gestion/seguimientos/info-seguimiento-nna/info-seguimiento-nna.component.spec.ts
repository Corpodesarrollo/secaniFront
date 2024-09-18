import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSeguimientoNnaComponent } from './info-seguimiento-nna.component';

describe('InfoSeguimientoNnaComponent', () => {
  let component: InfoSeguimientoNnaComponent;
  let fixture: ComponentFixture<InfoSeguimientoNnaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoSeguimientoNnaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoSeguimientoNnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
