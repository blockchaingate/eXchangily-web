import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanStatsComponent } from './kanban-stats.component';

describe('KanbanStatsComponent', () => {
  let component: KanbanStatsComponent;
  let fixture: ComponentFixture<KanbanStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KanbanStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KanbanStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
