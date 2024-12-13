/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PendienteReportarComponent } from './pendiente-reportar.component';

describe('PendienteReportarComponent', () => {
  let component: PendienteReportarComponent;
  let fixture: ComponentFixture<PendienteReportarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendienteReportarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendienteReportarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
