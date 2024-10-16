import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaPlantillaCorreoComponent } from './nueva-plantilla-correo.component';

describe('NuevaPlantillaCorreoComponent', () => {
  let component: NuevaPlantillaCorreoComponent;
  let fixture: ComponentFixture<NuevaPlantillaCorreoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevaPlantillaCorreoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevaPlantillaCorreoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
