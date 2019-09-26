import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrderSubmissionComponent } from './create-order-submission.component';

describe('CreateOrderSubmissionComponent', () => {
  let component: CreateOrderSubmissionComponent;
  let fixture: ComponentFixture<CreateOrderSubmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateOrderSubmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrderSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
