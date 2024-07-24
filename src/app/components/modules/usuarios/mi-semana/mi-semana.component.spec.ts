/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MiSemanaComponent } from './mi-semana.component';

describe('MiSemanaComponent', () => {
  let component: MiSemanaComponent;
  let fixture: ComponentFixture<MiSemanaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiSemanaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiSemanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
