import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-app-intro',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './app-intro.component.html',
  styleUrls: ['./app-intro.component.scss']
})
export class AppIntroComponent implements OnInit {
  @Input() showHeadOnly = false;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  linkTo(url: string) {
    this.router.navigate([url]);

  }

}
