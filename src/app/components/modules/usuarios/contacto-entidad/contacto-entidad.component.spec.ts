import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactoEntidadComponent } from './contacto-entidad.component';

describe('ContactoEntidadComponent', () => {
  let component: ContactoEntidadComponent;
  let fixture: ComponentFixture<ContactoEntidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactoEntidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactoEntidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
