import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketTopBlockComponent } from './market-top-block.component';

describe('MarketTopBlockComponent', () => {
  let component: MarketTopBlockComponent;
  let fixture: ComponentFixture<MarketTopBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketTopBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketTopBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
