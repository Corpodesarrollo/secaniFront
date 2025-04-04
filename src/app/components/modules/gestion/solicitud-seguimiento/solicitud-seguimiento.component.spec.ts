import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudSeguimientoComponent } from './solicitud-seguimiento.component';

describe('SolicitudSeguimientoComponent', () => {
  let component: SolicitudSeguimientoComponent;
  let fixture: ComponentFixture<SolicitudSeguimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudSeguimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudSeguimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
