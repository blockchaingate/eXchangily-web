import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TxDetailsComponent } from './tx-details.component';

describe('TxDetailsComponent', () => {
  let component: TxDetailsComponent;
  let fixture: ComponentFixture<TxDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TxDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TxDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
