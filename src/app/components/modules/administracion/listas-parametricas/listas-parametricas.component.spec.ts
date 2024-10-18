import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListasParametricasComponent } from './listas-parametricas.component';

describe('ListasParametricasComponent', () => {
  let component: ListasParametricasComponent;
  let fixture: ComponentFixture<ListasParametricasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListasParametricasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListasParametricasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
