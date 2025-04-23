import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-intro',
  templateUrl: './app-intro.component.html',
  styleUrls: ['./app-intro.component.scss']
})
export class AppIntroComponent implements OnInit {
  @Input() showHeadOnly: boolean;
  constructor(
     private router: Router,
  ) { }

  ngOnInit(): void {
  }

  linkTo(url: string) {
    this.router.navigate([url]);

  }

}
