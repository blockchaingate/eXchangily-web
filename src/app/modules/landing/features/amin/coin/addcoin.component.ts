import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from '../../../service/app-service/app.service';
import { AppAuthService } from '../../../service/app-auth/app-auth.service';
import { Application } from '../../../models/application';

@Component({
  selector: 'app-addcoin',
  templateUrl: './addcoin.component.html',
  styleUrls: ['./addcoin.component.css']
})
export class AddcoinComponent implements OnInit {
  applica: Application;
    coinForm: FormGroup;
    successMsg: string;
    errMsg: string;

    coins = [{
        symbol: 'BTC',
        address: '1GdAhHtamA1UkN33wAAVy9zmU99ua1j7F2'
       },
       {
        symbol: 'ETH',
        address: '0x7cd0CAD7a4bEb59307E836142d4b340652Fa9Ec9'
       },
       {
        symbol: 'FAB',
        address: '1fsACcz6w5HF48S2vB5AQ8Lukn7npb8cm'
       }];

  constructor(private _appServ: AppService, private _appAuth: AppAuthService) {}

  ngOnInit() {
    this.loadApp();

    this.coinForm = new FormGroup({
      'symbol': new FormControl('', [
        Validators.required
      ]),
      'address': new FormControl('', [
        Validators.required
      ])
    });
  }

  loadApp() {
    this._appServ.getApp().subscribe(
      ret => { this.applica = ret; },
      err => { this.errMsg = err; }
    );
  }

  addCoins () {
    const sym: string = this.coinForm.get('symbol').value.toUpperCase();
    const adds: string = this.coinForm.get('address').value;
    const coin = {symbol: sym, add: adds};
    if (!this.applica.coins || this.applica.coins.length < 1) {
      this.applica.coins = new Array<{symbol: string, add: string}>();
      this.applica.coins.push(coin);
    } else {
      let exist = false;
      for (let i = 0; i < this.applica.coins.length; i++) {
        if (this.applica.coins[i] && this.applica.coins[i].symbol === sym) {
          this.applica.coins[i] = coin;
          exist = true;
          break;
        }
      }

      if (!exist) {
        this.applica.coins.push(coin);
      }
    }
    // this.coinForm.get('symbol').setValue('');
    // this.coinForm.get('address').setValue('');
  }

  saveCoins() {
    this._appServ.updateApp(this.applica).subscribe(
      ret => { this.errMsg = 'Submit successful.'; },
      err => { this.errMsg = 'Failure submit.'; }
    );
  }

}
