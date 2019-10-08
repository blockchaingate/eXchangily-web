import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewReferralsComponent } from './view-referrals.component';

describe('ViewReferralsComponent', () => {
  let component: ViewReferralsComponent;
  let fixture: ComponentFixture<ViewReferralsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewReferralsComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewReferralsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
