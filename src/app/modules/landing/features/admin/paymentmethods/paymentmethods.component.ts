import { Component, OnInit, Input } from '@angular/core';
import { PaymentMethodService } from '../../../../../services/paymentmethod.service';
import { StorageService } from '../../../../../services/storage.service';

@Component({
  selector: 'app-paymentmethods',
  templateUrl: './paymentmethods.component.html',
  styleUrls: ['./paymentmethods.component.scss']
})
export class PaymentMethodsComponent implements OnInit {
  name = '';
  token = '';
  paymentmethods: any;
  constructor(private _storageServ: StorageService, private paymentmethodServ: PaymentMethodService) { }

  ngOnInit() {
    this._storageServ.getToken().subscribe(
      (token: any) => {
        this.token = token;
      });
    this.paymentmethodServ.getPaymentMethods().subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.paymentmethods = res._body;
          console.log('this.paymentmethods===', this.paymentmethods);
        }
      });
  }

  onSearchChange(name: string) {
    console.log('name', name);
    this.name = name;
  }

  onSearchChangeEvent(event: any) {
    const name = event?.target?.value;
    this.onSearchChange(name);
  }

  delete(paymentmethodid: string) {
    this.paymentmethodServ.deletePaymentmethod(this.token, paymentmethodid).subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.paymentmethods = this.paymentmethods.filter((item: any) => { item._id.toString() != paymentmethodid.toString() });
        }
      }
    );
  }

  add() {
    console.log('this.name=', this.name);
    this.paymentmethodServ.addPaymentmethod(this.token, this.name).subscribe((res: any) => {
      if (res && res.ok) {
      }
    }
    );
  }
}
