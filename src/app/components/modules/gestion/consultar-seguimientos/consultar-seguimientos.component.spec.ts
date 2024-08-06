import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarSeguimientosComponent } from './consultar-seguimientos.component';

describe('ConsultarSeguimientosComponent', () => {
  let component: ConsultarSeguimientosComponent;
  let fixture: ComponentFixture<ConsultarSeguimientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarSeguimientosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarSeguimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
