import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoDatosComponent } from './seguimiento-datos.component';

describe('SeguimientoDatosComponent', () => {
  let component: SeguimientoDatosComponent;
  let fixture: ComponentFixture<SeguimientoDatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguimientoDatosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
