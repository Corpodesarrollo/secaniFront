import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearNnaAgregarContactoComponent } from './crear-nna-agregar-contacto.component';

describe('CrearNnaAgregarContactoComponent', () => {
  let component: CrearNnaAgregarContactoComponent;
  let fixture: ComponentFixture<CrearNnaAgregarContactoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearNnaAgregarContactoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearNnaAgregarContactoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
