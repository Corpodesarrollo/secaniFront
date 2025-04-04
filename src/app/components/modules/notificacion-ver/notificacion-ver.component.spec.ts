import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionVerComponent } from './notificacion-ver.component';

describe('NotificacionVerComponent', () => {
  let component: NotificacionVerComponent;
  let fixture: ComponentFixture<NotificacionVerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificacionVerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificacionVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
