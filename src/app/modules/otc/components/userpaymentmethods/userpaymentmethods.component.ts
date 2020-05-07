import { Component, OnInit, Input } from '@angular/core';
import { PaymentMethodService } from '../../../../services/paymentmethod.service';
import { StorageService } from '../../../../services/storage.service';

@Component({
  selector: 'app-userpaymentmethods',
  templateUrl: './userpaymentmethods.component.html',
  styleUrls: ['./userpaymentmethods.component.css']
})
export class UserPaymentMethodsComponent implements OnInit {
  name: string;
  content: string;
  details: string;
  token: string;
  userpaymentmethod: any;
  userpaymentmethods: any;
  paymentmethods: any;
  paymethod: any;
  constructor(private _storageServ: StorageService, private paymentmethodServ: PaymentMethodService) { }

  ngOnInit() {
    this._storageServ.getToken().subscribe(
      (token: string) => {
        this.token = token;  

        this.paymentmethodServ.getUserPaymentMethods(this.token).subscribe(
          (res: any) => {
            console.log('res for getUserPaymentMethods', res);
            
            if(res && res.ok) {
              this.userpaymentmethods = res._body;
            }
        });         
    });
    this.paymentmethodServ.getPaymentMethods().subscribe(
      (res: any) => {
        console.log('res for ');
        if(res && res.ok) {
          this.paymentmethods = res._body;
          console.log('this.paymentmethods===', this.paymentmethods);
        }
    });    
  }

  delete(userpaymentmethod_id: string) {
    this.paymentmethodServ.deleteUserPaymentmethod(this.token, userpaymentmethod_id).subscribe(
      
      (res: any) => {
        if(res && res.ok) {
          console.log('this.userpaymentmethods before===', this.userpaymentmethods);
          console.log('userpaymentmethod_id===', userpaymentmethod_id);
          this.userpaymentmethods = this.userpaymentmethods.filter((item) => {item._id.toString() != userpaymentmethod_id.toString()});
          console.log('this.userpaymentmethods===', this.userpaymentmethods);
        }
      }
    ); 
  }

  add() {
    const data = {
      paymethod: this.paymethod,
      details: this.details
    }
    this.paymentmethodServ.addUserPaymentmethod(this.token, data).subscribe(
      
      (res: any) => {
        if(res && res.ok) {
          this.userpaymentmethods.push(res._body);
        }
      }
    );    
  }
}
