import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoAdherenciaComponent } from './seguimiento-adherencia.component';

describe('SeguimientoAdherenciaComponent', () => {
  let component: SeguimientoAdherenciaComponent;
  let fixture: ComponentFixture<SeguimientoAdherenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguimientoAdherenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoAdherenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
