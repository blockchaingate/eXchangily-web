import { Component, TemplateRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { UtilService } from '../../../../services/util.service';
import { CoinService } from '../../../../services/coin.service';
import { KanbanService } from '../../../../services/kanban.service';
import { Web3Service } from '../../../../services/web3.service';
import { WalletService } from '../../../../services/wallet.service';
import { AlertService } from '../../../../services/alert.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Wallet } from '../../../../models/wallet';
import BigNumber from 'bignumber.js/bignumber';
import { TransactionResp } from '../../../../interfaces/kanban.interface';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss']
})
export class CodeComponent implements OnInit {
  gasLimit: number;
  gasPrice: number;
  pin: string;
  orderID: string;
  modalRef: BsModalRef;
  wallet: Wallet;
  wallets: Wallet[];
  merchant: any;
  code: string;
  coinID: number;
  available: string;
  amount: number;
  currency: string;
  items: any;
  description: string;
  currentWalletIndex: number;
  lan = 'en';

  constructor(
    private router: Router,

    private modalService: BsModalService,
    private utilService: UtilService,
    private _coinServ: CoinService,
    private route: ActivatedRoute,
    private alertServ: AlertService,
    private walletService: WalletService,
    private kanbanService: KanbanService,
    private web3Serv: Web3Service,
    private apiServ: ApiService) {

  }
  async ngOnInit() {
    this.pin = '';
    this.lan = localStorage.getItem('Lan');

    this.gasLimit = environment.chains.KANBAN.gasLimit;
    this.gasPrice = environment.chains.KANBAN.gasPrice;

    const code = this.route.snapshot.paramMap.get('code');
    this.code = code;
    this.apiServ.getOrderByCode(code).subscribe(
      (res: any) => {
        console.log('');
        if (res && res.ok) {
          const data = res._body;
          this.orderID = data._id;
          this.currency = data.paymentMethod ? data.paymentMethod.toUpperCase() : '';
          this.coinID = this._coinServ.getCoinTypeIdByName(data.paymentMethod);
          this.amount = data.totalToPay;
          this.items = data.items;
          console.log('this.items=', this.items);
          this.description = 'pay for order:' + data._id;
          console.log('this.coinID=', this.coinID);
          this.merchant = data.merchantId;
          this.loadWallets();
        }
      }
    );

  }

  async loadWallets() {
    this.wallets = await this.walletService.getWallets();
    if (!this.wallets || this.wallets.length === 0) {
      this.router.navigate(['/wallet/create']);
      return;
    }
    this.currentWalletIndex = await this.walletService.getCurrentWalletIndex();
    if (this.currentWalletIndex == null || this.currentWalletIndex < 0) {
      this.currentWalletIndex = 0;
    }
    if (this.currentWalletIndex > this.wallets.length - 1) {
      this.currentWalletIndex = this.wallets.length - 1;
    }
    this.wallet = this.wallets[this.currentWalletIndex];
    await this.loadWallet();
  }

  async changeWallet(value) {
    this.currentWalletIndex = value;
    // this.wallet = this.wallets[this.currentWalletIndex];
    // this.exgAddress = this.wallet.mycoins[0].receiveAdds[0].address;
    this.walletService.saveCurrentWalletIndex(this.currentWalletIndex);
    this.wallet = this.wallets[this.currentWalletIndex];
    // console.log('this.currentWalletIndex=' + this.currentWalletIndex);
    await this.loadWallet();
  }

  loadWallet() {
    const address = this.wallet.excoin.receiveAdds[0].address;
    console.log('address=', address);
    this.kanbanService.getBalance(address).subscribe(
      (res: any) => {
        console.log('res==', res);
        const coin = this.coinID;
        for (let i = 0; i < res.length; i++) {
          const item = res[i];
          if (item.coinType == coin) {
            this.available = this.utilService.showAmount(item.unlockedAmount, 18);
          }
        }
      }
    );
  }
  confirm(pinModal) {
    this.openModal(pinModal);
  }

  confirmPin() {
    const pwdHashStr = this.utilService.SHA256(this.pin).toString();
    if (this.wallet.pwdHash !== pwdHashStr) {
      if (this.lan === 'zh') {
        this.alertServ.openSnackBar('密码错误1', 'Ok');
      } else {
        this.alertServ.openSnackBar('Your password is invalid', 'Ok');
      }
      return;
    }

    this.transferCoin();
  }

  changePin(event) {
    console.log(event);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'second' });
  }

  async transferCoin() {
    const address = this.utilService.fabToExgAddress(this.merchant.walletExgAddress);
    const amount = this.amount;
    const coin = this.coinID;
    const txHex = await this.txHexforSendToken(
      this.pin, this.wallet, address, coin, new BigNumber(amount).multipliedBy(new BigNumber(1e18)).toFixed()
    );

    this.apiServ.chargeOrder(this.orderID, txHex).subscribe(
      (res: any) => {
        if (res && res.ok) {
          if (this.lan === 'zh') {
            this.alertServ.openSnackBarSuccess('转账提交成功。', 'Ok');
          } else {
            this.alertServ.openSnackBarSuccess('Send Coin Transaction was submitted successfully.', 'Ok');
          }
        } else {
          if (res._body) {
            this.alertServ.openSnackBarSuccess(res._body, 'Ok');
          } else {
            if (this.lan === 'zh') {
              this.alertServ.openSnackBarSuccess('转账提交失败。', 'Ok');
            } else {
              this.alertServ.openSnackBarSuccess('Send Coin Transaction failed.', 'Ok');
            }
          }

        }
      }
    );

  }

  async txHexforSendToken
    (pin: string, wallet: any, to: string, coin: number, value: string) {

    const seed = this.utilService.aesDecryptSeed(wallet.encryptedSeed, pin);
    const keyPairsKanban = this._coinServ.getKeyPairs(wallet.excoin, seed, 0, 0);

    const address = await this.kanbanService.getCoinPoolAddress();

    const func = {
      'constant': false,
      'inputs': [
        {
          'name': '_to',
          'type': 'address'
        },
        {
          'name': '_coinType',
          'type': 'uint32'
        },
        {
          'name': '_value',
          'type': 'uint256'
        }
      ],
      'name': 'transfer',
      'outputs': [
        {
          'name': 'success',
          'type': 'bool'
        }
      ],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    };

    const params = [to, coin, value];

    const abiHex = this.web3Serv.getGeneralFunctionABI(func, params);

    const nonce = await this.kanbanService.getTransactionCount(keyPairsKanban.address);

    if ((this.gasPrice <= 0) || (this.gasLimit <= 0)) {
      return;
    }
    const options = {
      gasPrice: this.gasPrice,
      gasLimit: this.gasLimit
    };

    const txHex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, address, nonce, 0, options);
    return txHex;
  }
}