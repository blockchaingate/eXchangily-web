import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { KanbanService } from './services/kanban.service';

@Component({
  selector: 'app-kanbanexplorer',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, RouterLink, RouterOutlet, TranslateModule],
  providers: [KanbanService],
  templateUrl: './kanbanexplorer.component.html',
  styleUrls: ['./kanbanexplorer.component.css']
})
export class KanbanexplorerComponent {
  constructor(private router: Router) {
  }

  title = 'KanbanExplorer';

  searchClicked(v: any) {
    // if block number, go to block details page
    this.router.navigate(['/block-detail/' + v]);
    if (typeof v === 'number') {
      console.log('blocknumber', v);
    }
  }
}
