/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CasosTerritorioComponent } from './casos-territorio.component';

describe('CasosTerritorioComponent', () => {
  let component: CasosTerritorioComponent;
  let fixture: ComponentFixture<CasosTerritorioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasosTerritorioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasosTerritorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
