import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutSecondaryComponent } from './layout-secondary.component';

describe('LayoutSecondaryComponent', () => {
  let component: LayoutSecondaryComponent;
  let fixture: ComponentFixture<LayoutSecondaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutSecondaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutSecondaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
