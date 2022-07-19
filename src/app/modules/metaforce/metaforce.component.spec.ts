import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetaforceComponent } from './metaforce.component';

describe('MetaforceComponent', () => {
  let component: MetaforceComponent;
  let fixture: ComponentFixture<MetaforceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetaforceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetaforceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
