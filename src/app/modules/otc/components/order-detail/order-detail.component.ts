import { Component, OnInit } from '@angular/core';
import { OtcService } from '../../../../services/otc.service';
import { ActivatedRoute } from "@angular/router";
import { ApiService } from '../../../../services/api.service';
import { environment } from '../../../../../environments/environment';
import { UserService } from '../../../../services/user.service';
import { StorageService } from '../../../../services/storage.service';

@Component({
  selector: 'app-otc-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  id: string;
  order: any;
  user: any;
  constructor(
    private storageService: StorageService,
    private userServ: UserService,
    private apiServ: ApiService,
    private route: ActivatedRoute,
    private _otcServ: OtcService) {

  }
  ngOnInit() {

    this.storageService.getToken().subscribe(
      (token: string) => {
        this.userServ.getMe(token).subscribe(
          (res: any) => {
            console.log('res===', res);
            if (res && res.ok) {
              this.user = res._body;
            }
          }
        );        
      }
    );
    this.id = this.route.snapshot.paramMap.get("id");
    this._otcServ.getOrder(this.id).subscribe(
      (res: any) => {
        if(res.ok) {
          this.order = res._body;
        }
      }
    );      
  }

  payByEpay() {
    const currency = this.order.currency;
    if (!this.order.totalToPay) {
        return;
    }
    const amount = this.order.totalToPay;

    const paymentAmount = amount;
    const paymentUnit = currency;    
    this.apiServ.getEpayHash(paymentAmount, paymentUnit).subscribe(
      (ret: any) => {
        if(ret && ret.ok) {

          const paymentId = 'otc_' + this.id;


          const data = ret._body;
          const hash = data.hash;
          const payeeAccount = data.payeeAccount;
          console.log('hash=', hash);
          const mapForm = document.createElement('form');
          mapForm.method = 'POST';
          mapForm.target = '_blank';
          mapForm.action = `${environment.EPAY_API}/merReceive`;
          mapForm.style.display = 'none';
          
          const mapInput = document.createElement('input');
          mapInput.type = 'hidden';
          mapInput.name = 'PAYEE_ACCOUNT';
          mapInput.value = payeeAccount;
          mapForm.appendChild(mapInput);
          

          const mapInput1 = document.createElement('input');
          mapInput1.type = 'hidden';
          mapInput1.name = 'PAYEE_NAME';
          mapInput1.value = this.order.merchantId.name;
          mapForm.appendChild(mapInput1);
      
          const mapInput2 = document.createElement('input');
          mapInput2.type = 'hidden';
          mapInput2.name = 'PAYMENT_AMOUNT';
          mapInput2.value = paymentAmount.toString();
          mapForm.appendChild(mapInput2);
      
          const mapInput3 = document.createElement('input');
          mapInput3.type = 'hidden';
          mapInput3.name = 'PAYMENT_UNITS';
          mapInput3.value = paymentUnit;
          mapForm.appendChild(mapInput3);
      
      
          const mapInput5 = document.createElement('input');
          mapInput5.type = 'hidden';
          mapInput5.name = 'STATUS_URL';
          mapInput5.value = environment.endpoints.blockchaingate + 'epay/callback';
          mapForm.appendChild(mapInput5);
      
      
          const mapInput6 = document.createElement('input');
          mapInput6.type = 'hidden';
          mapInput6.name = 'PAYMENT_URL';
          mapInput6.value = environment.baseUrl + '/home/paymentsuccess';
          mapForm.appendChild(mapInput6);
      
          const mapInput7 = document.createElement('input');
          mapInput7.type = 'hidden';
          mapInput7.name = 'NOPAYMENT_URL';
          mapInput7.value = environment.baseUrl + '/home/paymentfail';
          mapForm.appendChild(mapInput7);
          
          const mapInput8 = document.createElement('input');
          mapInput8.type = 'hidden';
          mapInput8.name = 'PAYMENT_ID';
          mapInput8.value = paymentId;
          mapForm.appendChild(mapInput8);
      
          
          const mapInput9 = document.createElement('input');
          mapInput9.type = 'hidden';
          mapInput9.name = 'V2_HASH';
          mapInput9.value = hash;
          mapForm.appendChild(mapInput9);

          
          const mapInput10 = document.createElement('input');
          mapInput10.type = 'hidden';
          mapInput10.name = 'SUGGESTED_MEMO';
          const coinName = this.order.items[0].title;
          mapInput10.value = this.user.email + ' buy ' + this.order.items[0].quantity + coinName + ' with ' + paymentAmount + paymentUnit + '(receiving address:';
          if(coinName == 'BTC') {
            mapInput10.value += this.user.walletBtcAddress;
          } else 
          if(coinName == 'ETH' || coinName == 'USDT') {
            mapInput10.value += this.user.walletEthAddress;
          } else 
          if(coinName == 'FAB' || coinName == 'EXG') {
            mapInput10.value += this.user.walletExgAddress;
          }
          mapInput10.value +=  ')';
          mapForm.appendChild(mapInput10);                
       
      
      
          document.body.appendChild(mapForm);
          
          mapForm.submit();
        }
      }
    );    
  }
}