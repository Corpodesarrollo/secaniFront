import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrarnnaComponent } from './filtrarnna.component';

describe('FiltrarnnaComponent', () => {
  let component: FiltrarnnaComponent;
  let fixture: ComponentFixture<FiltrarnnaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltrarnnaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltrarnnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
