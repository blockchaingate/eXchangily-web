import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-issue-token-erc20',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './frc20.component.html',
  styleUrls: ['./frc20.component.scss']
})
export class IssueTokenFrc20Component implements OnInit {
  constructor() { }

  ngOnInit() {
  }
}
