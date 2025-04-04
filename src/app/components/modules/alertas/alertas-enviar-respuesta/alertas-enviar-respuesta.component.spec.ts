import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertasEnviarRespuestaComponent } from './alertas-enviar-respuesta.component';

describe('AlertasEnviarRespuestaComponent', () => {
  let component: AlertasEnviarRespuestaComponent;
  let fixture: ComponentFixture<AlertasEnviarRespuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertasEnviarRespuestaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertasEnviarRespuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
