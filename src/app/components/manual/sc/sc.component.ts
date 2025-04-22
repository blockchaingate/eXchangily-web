import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sc',
  standalone: true,
  imports: [CommonModule, MatCardModule, TranslateModule],
  templateUrl: './sc.component.html',
  styleUrls: ['./sc.component.css']
})
export class ScComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
