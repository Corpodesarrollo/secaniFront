import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoTrasladoComponent } from './seguimiento-traslado.component';

describe('SeguimientoTrasladoComponent', () => {
  let component: SeguimientoTrasladoComponent;
  let fixture: ComponentFixture<SeguimientoTrasladoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguimientoTrasladoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoTrasladoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
