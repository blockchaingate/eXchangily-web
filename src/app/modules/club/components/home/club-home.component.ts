import { Component, OnInit } from '@angular/core';
import { ClubService } from '../../services/club.service';

@Component({
  selector: 'app-club-home',
  templateUrl: './club-home.component.html',
  styleUrls: ['./club-home.component.css']
})
export class ClubHomeComponent implements OnInit {
  constructor(private _clubServ: ClubService) {}
  
  ngOnInit() {
  }
}
