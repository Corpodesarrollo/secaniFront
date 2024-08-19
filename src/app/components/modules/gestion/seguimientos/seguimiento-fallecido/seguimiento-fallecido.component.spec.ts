import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoFallecidoComponent } from './seguimiento-fallecido.component';

describe('SeguimientoFallecidoComponent', () => {
  let component: SeguimientoFallecidoComponent;
  let fixture: ComponentFixture<SeguimientoFallecidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguimientoFallecidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoFallecidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
