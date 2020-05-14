import { Component, OnInit } from '@angular/core';
import { KanbanService } from '../../services/kanban.service';
import { KanbanStats } from '../../models/kanbanStats';

@Component({
  selector: 'app-kanban-stats',
  templateUrl: './kanban-stats.component.html',
  styleUrls: ['./kanban-stats.component.css']
})
export class KanbanStatsComponent implements OnInit {

  public kanbanStats : KanbanStats
  private interval 
  constructor(private kanbanService:KanbanService) { 
    this.getKanbanStats()
    
    this.interval = setInterval(()=>{
      this.getKanbanStats()
    },10000)
  }

  ngOnInit(): void {
    
  }

  getKanbanStats(){
      this.kanbanService.getKanbanStats().subscribe(r=>{
        this.kanbanStats = r
      })
  }

}
