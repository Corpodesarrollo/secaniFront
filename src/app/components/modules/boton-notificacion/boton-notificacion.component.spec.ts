import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonNotificacionComponent } from './boton-notificacion.component';

describe('BotonNotificacionComponent', () => {
  let component: BotonNotificacionComponent;
  let fixture: ComponentFixture<BotonNotificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonNotificacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotonNotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
