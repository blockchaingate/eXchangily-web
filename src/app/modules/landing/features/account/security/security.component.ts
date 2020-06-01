import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../../../services/storage.service';
import { UserService } from '../../../service/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {
  token: string;
  mobile: string;
  verificationCode: string;
  step: number;
  constructor(
    private _router: Router,
    private storageService: StorageService,
    private userServ: UserService) { }

  ngOnInit() {
    this.step = 1;
      this.storageService.getToken().subscribe(
        (token: string) => {
          this.token = token;
          if (!this.token) {
            this._router.navigate(['/login/signin', { 'retUrl': '/account/security' }]);
          } else {
            this.userServ.getMe(this.token).subscribe(
              (res: any) => {
                if(res && res.ok) {
                  const data = res._body;
                  console.log('data==', data);
                  if(data.mobile) {
                    this.mobile = data.mobile;
                  }
                  
                }
              }
            );
          }
        });        
  }

  reset() {
    this.mobile = '';
  }

  validateNumber() {
    this.userServ.validateNumber(this.token, this.mobile).subscribe(
      (res: any) => {
        if(res && res.ok) {
          const data = res._body;
          this.step = 2;
          console.log('data for validateNumber==', data);
          
        }
      }
    );    
  }

  confirmValifacationCode() {
    this.userServ.confirmValifacationCode(this.token, this.verificationCode).subscribe(
      (res: any) => {
        if(res && res.ok) {
          const data = res._body;
          
        }
      }
    );      
  }
}