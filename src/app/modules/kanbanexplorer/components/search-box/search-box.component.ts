import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KanbanService } from '../../services/kanban.service';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {
  constructor(private router: Router, private service: KanbanService) { }

  ngOnInit(): void {
  }

  searchClicked(v: any) {
    // assuming v is a number
    // this.router.navigate(['/block-detail/'+v])
    this.service.validateInputAndSetRoute(v);
  }
}
