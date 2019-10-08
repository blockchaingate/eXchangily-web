import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcotxComponent } from './icotx.component';

describe('IcotxComponent', () => {
  let component: IcotxComponent;
  let fixture: ComponentFixture<IcotxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcotxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcotxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
