import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoNnaComponent } from './estado-nna.component';

describe('EstadoNnaComponent', () => {
  let component: EstadoNnaComponent;
  let fixture: ComponentFixture<EstadoNnaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadoNnaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadoNnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
