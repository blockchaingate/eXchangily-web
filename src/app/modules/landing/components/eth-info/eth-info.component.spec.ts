import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EthInfoComponent } from './eth-info.component';

describe('EthInfoComponent', () => {
  let component: EthInfoComponent;
  let fixture: ComponentFixture<EthInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EthInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EthInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
