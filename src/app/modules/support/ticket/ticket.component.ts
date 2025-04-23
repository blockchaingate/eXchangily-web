import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-ticket',
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
