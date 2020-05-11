import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  year: number;
  lang = 'en';

  constructor() { }

  ngOnInit() {
    this.year = (new Date()).getFullYear();
    this.lang = window.localStorage.getItem('Lan').toLowerCase();
  }

}
