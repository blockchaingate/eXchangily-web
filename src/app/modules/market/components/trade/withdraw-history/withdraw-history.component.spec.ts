import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawHistoryComponent } from './withdraw-history.component';

describe('WithdrawHistoryComponent', () => {
  let component: WithdrawHistoryComponent;
  let fixture: ComponentFixture<WithdrawHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithdrawHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
