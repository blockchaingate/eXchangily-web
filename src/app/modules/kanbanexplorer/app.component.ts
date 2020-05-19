import { Component } from '@angular/core';
import { BlocksComponent } from './components/blocks/blocks.component'
import { Router } from '@angular/router';
import { SearchBoxComponent } from './components/search-box/search-box.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private router:Router){

  }

  title = 'KanbanExplorer';

  searchClicked(v:any){ 
     //if block number, go to block details page
      this.router.navigate(['/block-detail/'+v])
    if(typeof v === 'number'){
      console.log("blocknumber",v)
    
    }
  }
}