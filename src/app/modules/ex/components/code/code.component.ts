import { Component, TemplateRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  pinn: string;
  modalRef: BsModalRef;
  wallet: Wallet;
  merchant: any;
  gateway: any;
  lan = 'en';

  constructor(
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
    this.pinn = '';
    this.lan = localStorage.getItem('Lan');
    this.wallet = await this.walletService.getCurrentWallet();
    this.gasLimit = environment.chains.KANBAN.gasLimit;
    this.gasPrice = environment.chains.KANBAN.gasPrice;

    const code = this.route.snapshot.paramMap.get('code');
    console.log('code=', code);
    this.apiServ.getExTransaction(code).subscribe(
      (res: any) => {
        console.log('res==', res);
        if(res && res.ok) {
          const data = res._body;
          this.merchant = data.merchant;
          this.gateway = data.gateway;
        }
      }
    );
  }


  confirm(pinModal) {
    this.openModal(pinModal);
  }

  confirmPin() {
    console.log('this.pin=', this.pinn);
    this.pinn = '1qaz@WSX';
    const pwdHashStr = this.utilService.SHA256(this.pinn).toString();
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
    const txHex = await this.txHexforSendToken(
      this.pinn, this.wallet, '0x07b14b1a46438f242654effb746f5b55378d8288', 1, new BigNumber(2).multipliedBy(new BigNumber(1e6)).toFixed()
    );

    this.kanbanService.sendRawSignedTransaction(txHex).subscribe((resp: TransactionResp) => {

      if (resp && resp.transactionHash) {
        this.kanbanService.incNonce();
        if (this.lan === 'zh') {
          this.alertServ.openSnackBarSuccess('转账提交成功。', 'Ok');
        } else {
          this.alertServ.openSnackBarSuccess('Send Coin Transaction was submitted successfully.', 'Ok');
        }

        const address = this.wallet.excoin.receiveAdds[0].address;


      } else {
        if (this.lan === 'zh') {
          this.alertServ.openSnackBar('创建转账交易时发生错误, 提交失败。', 'Ok');
        } else {
          this.alertServ.openSnackBar('Error happened while sending coin.', 'Ok');
        }
      }
    },
      error => {
        this.alertServ.openSnackBar(error.error, 'Ok');
      }
    );
  }

  async txHexforSendToken
    (pin: string, wallet: any,  to: string, coin: number, value: string) {

    const seed = this.utilService.aesDecryptSeed(wallet.encryptedSeed, pin);
    const keyPairsKanban = this._coinServ.getKeyPairs(wallet.excoin, seed, 0, 0);

    const address = await this.kanbanService.getCoinPoolAddress();

    const func = {
      "constant": false,
      "inputs": [
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_coinType",
          "type": "uint32"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "name": "success",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    };

    const params = [to, coin, value];
    console.log('params==', params);
    const abiHex = this.web3Serv.getGeneralFunctionABI(func, params);

    console.log('abiHex=', abiHex);
    const nonce = await this.kanbanService.getTransactionCount(keyPairsKanban.address);

    if ((this.gasPrice <= 0) || (this.gasLimit <= 0)) {
      return;
    }
    const options = {
      gasPrice: this.gasPrice * 1.3,
      gasLimit: this.gasLimit
    };

    const txHex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, address, nonce, 0, options);
    return txHex;
  }  
}