import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargueMasivoComponent } from './cargue-masivo.component';

describe('CargeMasivoComponent', () => {
  let component: CargueMasivoComponent;
  let fixture: ComponentFixture<CargueMasivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargueMasivoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargueMasivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
