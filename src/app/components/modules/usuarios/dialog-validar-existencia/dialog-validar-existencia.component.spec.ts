import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogValidarExistenciaComponent } from './dialog-validar-existencia.component';

describe('DialogValidarExistenciaComponent', () => {
  let component: DialogValidarExistenciaComponent;
  let fixture: ComponentFixture<DialogValidarExistenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogValidarExistenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogValidarExistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
