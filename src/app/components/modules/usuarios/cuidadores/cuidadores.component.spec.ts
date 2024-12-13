import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuidadoresComponent } from './cuidadores.component';

describe('CuidadoresComponent', () => {
  let component: CuidadoresComponent;
  let fixture: ComponentFixture<CuidadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuidadoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuidadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
