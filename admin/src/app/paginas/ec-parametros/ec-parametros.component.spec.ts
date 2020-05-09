import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcParametrosComponent } from './ec-parametros.component';

describe('EcParametrosComponent', () => {
  let component: EcParametrosComponent;
  let fixture: ComponentFixture<EcParametrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcParametrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcParametrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
