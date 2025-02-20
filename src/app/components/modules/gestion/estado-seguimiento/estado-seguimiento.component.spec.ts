import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoSeguimientoComponent } from './estado-seguimiento.component';

describe('EstadoSeguimientoComponent', () => {
  let component: EstadoSeguimientoComponent;
  let fixture: ComponentFixture<EstadoSeguimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadoSeguimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadoSeguimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
