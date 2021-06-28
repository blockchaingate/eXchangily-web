import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-app-intro',
  templateUrl: './app-intro.component.html',
  styleUrls: ['./app-intro.component.scss']
})
export class AppIntroComponent implements OnInit {
  @Input() showHeadOnly: boolean;
  constructor() { }

  ngOnInit(): void {
  }

}
