import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyDisplayComponent } from './currency-display.component';

describe('CurrencyDisplayComponent', () => {
  let component: CurrencyDisplayComponent;
  let fixture: ComponentFixture<CurrencyDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrencyDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
