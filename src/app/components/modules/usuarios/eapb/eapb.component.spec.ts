import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EAPBComponent } from './eapb.component';

describe('EAPBComponent', () => {
  let component: EAPBComponent;
  let fixture: ComponentFixture<EAPBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EAPBComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EAPBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
