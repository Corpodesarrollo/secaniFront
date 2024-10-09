import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantillasCorreoComponent } from './plantillas-correo.component';

describe('PlantillasCorreoComponent', () => {
  let component: PlantillasCorreoComponent;
  let fixture: ComponentFixture<PlantillasCorreoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantillasCorreoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantillasCorreoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
