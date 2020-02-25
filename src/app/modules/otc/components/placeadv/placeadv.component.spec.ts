import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceadvComponent } from './placeadv.component';

describe('PlaceadvComponent', () => {
  let component: PlaceadvComponent;
  let fixture: ComponentFixture<PlaceadvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaceadvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceadvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
