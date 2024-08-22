import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoDificultadesComponent } from './seguimiento-dificultades.component';

describe('SeguimientoDificultadesComponent', () => {
  let component: SeguimientoDificultadesComponent;
  let fixture: ComponentFixture<SeguimientoDificultadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguimientoDificultadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoDificultadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
