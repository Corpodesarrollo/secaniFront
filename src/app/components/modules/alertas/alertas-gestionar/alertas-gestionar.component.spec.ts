import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertasGestionarComponent } from './alertas-gestionar.component';

describe('AlertasGestionarComponent', () => {
  let component: AlertasGestionarComponent;
  let fixture: ComponentFixture<AlertasGestionarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertasGestionarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertasGestionarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
