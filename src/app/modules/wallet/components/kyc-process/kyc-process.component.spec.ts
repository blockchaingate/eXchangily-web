import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycProcessComponent } from './kyc-process.component';

describe('KycProcessComponent', () => {
  let component: KycProcessComponent;
  let fixture: ComponentFixture<KycProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KycProcessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KycProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
