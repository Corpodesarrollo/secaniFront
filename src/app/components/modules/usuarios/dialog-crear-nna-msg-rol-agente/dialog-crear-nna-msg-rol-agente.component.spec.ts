import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCrearNnaMsgRolAgenteComponent } from './dialog-crear-nna-msg-rol-agente.component';

describe('DigalogCrearNnaMsgRolAgenteComponent', () => {
  let component: DialogCrearNnaMsgRolAgenteComponent;
  let fixture: ComponentFixture<DialogCrearNnaMsgRolAgenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCrearNnaMsgRolAgenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCrearNnaMsgRolAgenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
