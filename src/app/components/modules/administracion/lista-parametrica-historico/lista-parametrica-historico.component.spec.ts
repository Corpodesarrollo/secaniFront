import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaParametricaHistoricoComponent } from './lista-parametrica-historico.component';

describe('ListaParametricaHistoricoComponent', () => {
  let component: ListaParametricaHistoricoComponent;
  let fixture: ComponentFixture<ListaParametricaHistoricoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaParametricaHistoricoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaParametricaHistoricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
