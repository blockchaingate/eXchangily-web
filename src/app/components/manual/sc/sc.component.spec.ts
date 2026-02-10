import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScComponent } from './sc.component';

describe('ScComponent', () => {
  let component: ScComponent;
  let fixture: ComponentFixture<ScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
