import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementAddComponent } from './announcement-add.component';

describe('AnnouncementAddComponent', () => {
  let component: AnnouncementAddComponent;
  let fixture: ComponentFixture<AnnouncementAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnouncementAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnouncementAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
