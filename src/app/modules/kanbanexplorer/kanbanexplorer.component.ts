import { Component } from '@angular/core';
import { BlocksComponent } from './components/blocks/blocks.component';
import { Router } from '@angular/router';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-kanbanexplorer',
  templateUrl: './kanbanexplorer.component.html',
  styleUrls: ['./kanbanexplorer.component.css']
})
export class KanbanexplorerComponent {
  constructor(private router: Router, private tasnServ: TranslateService) {
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
