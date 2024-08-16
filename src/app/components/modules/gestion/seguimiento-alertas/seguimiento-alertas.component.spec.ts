import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoAlertasComponent } from './seguimiento-alertas.component';

describe('SeguimientoAlertasComponent', () => {
  let component: SeguimientoAlertasComponent;
  let fixture: ComponentFixture<SeguimientoAlertasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeguimientoAlertasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoAlertasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
