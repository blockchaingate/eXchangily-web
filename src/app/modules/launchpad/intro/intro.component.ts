import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit {
    constructor() {
    }
    ngOnInit() {
    }

    goto(tabName: string) {
      window.location.hash = ''; 
      window.location.hash = tabName;
   
    }
}