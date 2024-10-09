import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaParametricaItemsComponent } from './lista-parametrica-items.component';

describe('ListaParametricaItemsComponent', () => {
  let component: ListaParametricaItemsComponent;
  let fixture: ComponentFixture<ListaParametricaItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaParametricaItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaParametricaItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
