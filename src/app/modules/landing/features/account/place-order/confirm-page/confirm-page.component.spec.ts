import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPageComponent } from './confirm-page.component';

describe('ConfirmPageComponent', () => {
  let component: ConfirmPageComponent;
  let fixture: ComponentFixture<ConfirmPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
