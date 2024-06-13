import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelOrdersComponent } from './cancel-orders.component';

describe('CancelOrdersComponent', () => {
  let component: CancelOrdersComponent;
  let fixture: ComponentFixture<CancelOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelOrdersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
