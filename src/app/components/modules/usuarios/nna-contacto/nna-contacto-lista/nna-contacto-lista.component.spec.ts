import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NnaContactoListaComponent } from './nna-contacto-lista.component';

describe('NnaContactoListaComponent', () => {
  let component: NnaContactoListaComponent;
  let fixture: ComponentFixture<NnaContactoListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NnaContactoListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NnaContactoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
