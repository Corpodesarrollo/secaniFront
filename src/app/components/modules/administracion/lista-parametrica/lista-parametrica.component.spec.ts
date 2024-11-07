import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaParametricaComponent } from './lista-parametrica.component';

describe('ListaParametricaComponent', () => {
  let component: ListaParametricaComponent;
  let fixture: ComponentFixture<ListaParametricaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaParametricaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaParametricaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
