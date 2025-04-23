import { Component, OnInit } from '@angular/core';
import { ClubService } from '../../services/club.service';

@Component({
  selector: 'app-none-member',
  templateUrl: './none-member.component.html',
  styleUrls: ['./none-member.component.css']
})
export class NoneMemberComponent implements OnInit {
  constructor(private _clubServ: ClubService) {}
  
  ngOnInit() {
  }
}
