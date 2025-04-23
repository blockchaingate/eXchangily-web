import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketAddComponent } from './ticket-add.component';

describe('TicketAddComponent', () => {
  let component: TicketAddComponent;
  let fixture: ComponentFixture<TicketAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
