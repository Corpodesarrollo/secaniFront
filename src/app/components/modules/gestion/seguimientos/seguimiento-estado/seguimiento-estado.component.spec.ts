import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoEstadoComponent } from './seguimiento-estado.component';

describe('SeguimientoEstadoComponent', () => {
  let component: SeguimientoEstadoComponent;
  let fixture: ComponentFixture<SeguimientoEstadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguimientoEstadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoEstadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
