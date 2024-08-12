import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IniciarSeguimientoComponent } from './iniciar-seguimiento.component';

describe('IniciarSeguimientoComponent', () => {
  let component: IniciarSeguimientoComponent;
  let fixture: ComponentFixture<IniciarSeguimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IniciarSeguimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IniciarSeguimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
