import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsdInfoComponent } from './usd-info.component';

describe('UsdInfoComponent', () => {
  let component: UsdInfoComponent;
  let fixture: ComponentFixture<UsdInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsdInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsdInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
