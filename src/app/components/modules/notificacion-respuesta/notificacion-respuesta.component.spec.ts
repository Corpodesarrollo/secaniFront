import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionRespuestaComponent } from './notificacion-respuesta.component';

describe('NotificacionRespuestaComponent', () => {
  let component: NotificacionRespuestaComponent;
  let fixture: ComponentFixture<NotificacionRespuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificacionRespuestaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificacionRespuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
