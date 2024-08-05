import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCrearContactoComponent } from './dialog-crear-contacto.component';

describe('DialogCrearContactoComponent', () => {
  let component: DialogCrearContactoComponent;
  let fixture: ComponentFixture<DialogCrearContactoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCrearContactoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCrearContactoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
