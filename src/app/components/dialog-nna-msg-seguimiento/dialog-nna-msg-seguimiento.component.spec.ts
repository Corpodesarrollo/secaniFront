import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNnaMsgSeguimientoComponent } from './dialog-nna-msg-seguimiento.component';

describe('DigalogCrearNnaMsgSeguimientoComponent', () => {
  let component: DialogNnaMsgSeguimientoComponent;
  let fixture: ComponentFixture<DialogNnaMsgSeguimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogNnaMsgSeguimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogNnaMsgSeguimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
