import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearNnaComponent } from './crear-nna.component';

describe('CrearNnaComponent', () => {
  let component: CrearNnaComponent;
  let fixture: ComponentFixture<CrearNnaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearNnaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearNnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
