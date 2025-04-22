import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-ticket-add',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './ticket-add.component.html',
  styleUrls: ['./ticket-add.component.scss']
})
export class TicketAddComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
