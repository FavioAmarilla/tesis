import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaContacto } from './contacto.page';

describe('PaginaContacto', () => {
  let component: PaginaContacto;
  let fixture: ComponentFixture<PaginaContacto>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginaContacto ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginaContacto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
