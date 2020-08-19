import { Component, OnInit, OnDestroy } from '@angular/core';
import { KanbanService } from '../../services/kanban.service';
import { KanbanStats } from '../../models/kanbanStats';

@Component({
  selector: 'app-kanban-stats',
  templateUrl: './kanban-stats.component.html',
  styleUrls: ['./kanban-stats.component.css']
})
export class KanbanStatsComponent implements OnInit, OnDestroy {

  public kanbanStats: KanbanStats;
  dividends: any;
  private interval;
  constructor(private kanbanService: KanbanService) {
    this.getKanbanStats();

    this.interval = setInterval(() => {
      this.getKanbanStats();
      this.getDividends();
    }, 10000);
  }

  ngOnInit(): void {

  }

  getKanbanStats() {
    this.kanbanService.getKanbanStats().subscribe(r => {
      this.kanbanStats = r;
    });
  }

  getDividends() {
    this.kanbanService.getDividends().subscribe(r => {
      if(r.success) {
        this.dividends = r.data;
      }
      
      console.log('dividends==', r);
    });
  }  

  ngOnDestroy() {
    if(this.interval) {
      clearInterval(this.interval);
    }
  }
}
