import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoNnaComponent } from './historico-nna.component';

describe('HistoricoNnaComponent', () => {
  let component: HistoricoNnaComponent;
  let fixture: ComponentFixture<HistoricoNnaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricoNnaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoNnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
