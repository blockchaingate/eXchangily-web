import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [CommonModule, MatTabsModule, TranslateModule],
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {
  tabTitles: string[] = [
    'ALL',
    'OPEN',
    'PROGRESSING',
    'CLOSED'
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
