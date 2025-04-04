import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantillaCorreoHistoricoComponent } from './plantilla-correo-historico.component';

describe('PlantillaCorreoHistoricoComponent', () => {
  let component: PlantillaCorreoHistoricoComponent;
  let fixture: ComponentFixture<PlantillaCorreoHistoricoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantillaCorreoHistoricoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantillaCorreoHistoricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
