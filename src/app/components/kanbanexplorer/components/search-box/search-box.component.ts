import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KanbanService } from '../../services/kanban.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, TranslateModule],
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
    if(v) {
      v = v.trim();
      this.service.validateInputAndSetRoute(v);
    }
    
  }
}
