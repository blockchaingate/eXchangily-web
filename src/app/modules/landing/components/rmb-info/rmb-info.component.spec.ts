import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RmbInfoComponent } from './rmb-info.component';

describe('RmbInfoComponent', () => {
  let component: RmbInfoComponent;
  let fixture: ComponentFixture<RmbInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RmbInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmbInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
