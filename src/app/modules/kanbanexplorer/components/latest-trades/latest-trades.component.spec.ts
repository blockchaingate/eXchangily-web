import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestTradesComponent } from './latest-trades.component';

describe('LatestTradesComponent', () => {
  let component: LatestTradesComponent;
  let fixture: ComponentFixture<LatestTradesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatestTradesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestTradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
