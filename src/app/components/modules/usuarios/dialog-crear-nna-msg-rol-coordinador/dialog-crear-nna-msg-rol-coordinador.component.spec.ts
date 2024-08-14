import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCrearNnaMsgRolCoordinadorComponent } from './dialog-crear-nna-msg-rol-coordinador.component';

describe('DialogCrearNnaMsgRolCoordinadorComponent', () => {
  let component: DialogCrearNnaMsgRolCoordinadorComponent;
  let fixture: ComponentFixture<DialogCrearNnaMsgRolCoordinadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCrearNnaMsgRolCoordinadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCrearNnaMsgRolCoordinadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
