import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestOrdersComponent } from './latest-orders.component';

describe('LatestOrdersComponent', () => {
  let component: LatestOrdersComponent;
  let fixture: ComponentFixture<LatestOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatestOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
