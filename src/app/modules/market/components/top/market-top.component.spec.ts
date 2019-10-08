import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketTopComponent } from './market-top.component';

describe('MarketTopComponent', () => {
  let component: MarketTopComponent;
  let fixture: ComponentFixture<MarketTopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketTopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
