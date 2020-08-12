import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../../../services/storage.service';
import { UserService } from '../../../service/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-merchant',
  templateUrl: './merchant.component.html',
  styleUrls: ['./merchant.component.scss']
})
export class MerchantComponent implements OnInit {
  token: string;
  mobile: string;
  verificationCode: string;
  step: number;
  constructor(
    private _router: Router,
    private storageService: StorageService,
    private userServ: UserService) { }

  ngOnInit() {
  }
}