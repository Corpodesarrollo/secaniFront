import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionOficioComponent } from './notificacion-oficio.component';

describe('NotificacionOficioComponent', () => {
  let component: NotificacionOficioComponent;
  let fixture: ComponentFixture<NotificacionOficioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificacionOficioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificacionOficioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
