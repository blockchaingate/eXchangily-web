import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kanbanexplorer',
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
