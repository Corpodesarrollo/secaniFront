import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleSeguimientosComponent } from './detalle-seguimientos.component';

describe('DetalleSeguimientosComponent', () => {
  let component: DetalleSeguimientosComponent;
  let fixture: ComponentFixture<DetalleSeguimientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleSeguimientosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleSeguimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
