import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoListadoPage } from './pedido-listado.page';

describe('PedidoListadoPage', () => {
  let component: PedidoListadoPage;
  let fixture: ComponentFixture<PedidoListadoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoListadoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoListadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
