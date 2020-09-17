import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppIntroComponent } from './app-intro.component';

describe('AppIntroComponent', () => {
  let component: AppIntroComponent;
  let fixture: ComponentFixture<AppIntroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppIntroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
