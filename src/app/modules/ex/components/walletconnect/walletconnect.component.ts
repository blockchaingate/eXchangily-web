import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core'; 
import SignClient from "@walletconnect/sign-client";
//import { SessionTypes } from "@walletconnect/types";
import { UtilService } from 'src/app/services/util.service';
import { WalletService } from 'src/app/services/wallet.service';
//import { ERROR, getAppMetadata } from "@walletconnect/utils";
import { Web3Service } from 'src/app/services/web3.service';
import { KanbanService } from 'src/app/services/kanban.service';
import { PinNumberModal } from '../../../shared/modals/pin-number/pin-number.modal';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { CoinService } from 'src/app/services/coin.service';
import { environment } from 'src/environments/environment';
import BigNumber from 'bignumber.js';

import { Core } from '@walletconnect/core'
import { Web3Wallet } from '@walletconnect/web3wallet'
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils'
import { MyCoin } from 'src/app/models/mycoin';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-walletconnect',
  templateUrl: './walletconnect.component.html',
  styleUrls: ['./walletconnect.component.css']
})
export class WalletconnectComponent implements OnInit {

  uri: string;
  session: any;
  state: string;
  proposal: any;
  topic: any;
  pin: string;
  id: string;
  wallet: any;
  permissions: any;
  metadata: any;
  relays: any;
  request: any;
  requiredNamespaces: any;
  walletAddress: string;
  params: any;
  web3wallet: any;
  ethAddress: string;
  kanbanChainId = environment.chains.KANBAN.chain.chainId;
  ethChainId = environment.chains.ETH.chainId;
  bnbChainId = environment.chains.BNB.chain.chainId;
  maticChainId = environment.chains.MATIC.chain.chainId;
  connectedChainId: number;
  ethCoin: MyCoin;
  bnbCoin: MyCoin;
  @ViewChild('pinModal', { static: true }) pinModal: PinNumberModal;

  constructor(
    private web3Serv: Web3Service,
    private translateServ: TranslateService,
    private kanbanServ: KanbanService,
    private coinServ: CoinService,
    private alertServ: AlertService,
    private cd: ChangeDetectorRef,
    private utilServ: UtilService,
    private apiServ: ApiService,
    private walletServ: WalletService) { }

  changeState(newState: string) {
    this.state = newState;
    this.cd.detectChanges();
  }
  async ngOnInit() {
    localStorage.clear();
    this.changeState('noSession');
    const wallet = await this.walletServ.getCurrentWallet();
    if (wallet) {
      this.wallet =wallet;
      const address = wallet.excoin.receiveAdds[0].address;
      this.walletAddress = address;
      const mycoins = wallet.mycoins;
      const ethCoins = mycoins.filter(item => ((item.name == 'ETH') && (item.symbol == 'ETH') && !item.tokenType));
      this.ethCoin = ethCoins[0];
      const bnbCoins = mycoins.filter(item => ((item.name == 'BNB') && (item.symbol == 'BNB') && !item.tokenType));
      this.bnbCoin = bnbCoins[0];
      this.ethAddress = this.ethCoin.receiveAdds[0].address;
    }
    try {
      if(this.web3wallet) {
        this.web3wallet.killSession();
      }
    } catch(e) {}

  }

  async onSessionDelete(args) {
    console.log('args on session delete=', args);
    const {id, topic} = args;
    this.disconnect();
  }

  async onSessionRequest(requestEvent) {
        const {id, params, topic} = requestEvent;
        this.id = id;
        const { chainId, request } = params;
        
        const connectedChainId = chainId.split(':')[1];
        this.connectedChainId = connectedChainId;
        this.topic = topic;
        this.request = request;
        this.changeState('sessionRequest');
    
  }
  onSessionProposal(proposal) {
    const {id, params} = proposal;
    this.id = id;
    this.params = params;
    const { proposer, requiredNamespaces, optionalNamespaces, relays, pairingTopic } = params;
    this.proposal = proposal;
    this.relays = relays;
    this.requiredNamespaces = requiredNamespaces;
    if(!requiredNamespaces.eip155) {
      this.requiredNamespaces = optionalNamespaces;
    }
    console.log('proposal===', proposal);
    console.log('params===', params);
    console.log('this.requiredNamespaces===', this.requiredNamespaces);
    this.topic = pairingTopic;
    const { metadata } = proposer;
    this.metadata = metadata;
    this.changeState('sessionProposal');
  }

  async disconnect() {
    if(this.web3wallet) {
      this.changeState('noSession');
      this.uri = '';
      await this.web3wallet.disconnectSession({
        topic: this.topic,
        reason: getSdkError('USER_DISCONNECTED')
      })
    }

  }

  showContractName(to: string) {
    if(environment.production && to == '0xd99bfcbfad77f57b5ed20286c24ad71785d73993' 
    || !environment.production && to == '0xa2370c422e2074ae2fc3d9d24f1e654c7fa3c181') {
      return 'Biswap Router'
    }
    return to;
  }

  timeConverter(UNIX_timestamp){
    var a = new Date(Math.floor(UNIX_timestamp / 1000) * 1000);
    //var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = a.getMonth() + 1;
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }

  showAddLiquidityData(body) {
    const decoded = this.web3Serv.decodeParameters(
      ['uint32', 'uint32', 'uint256', 'uint256', 'uint256', 'uint256', 'address', 'uint256'], 
      body);
    const tokenA =  this.coinServ.getCoinNameByTypeId(decoded[0]);
    const tokenB = this.coinServ.getCoinNameByTypeId(decoded[1]);
    const amountADesired =  new BigNumber(decoded[2]).shiftedBy(-18).toNumber();
    const amountBDesired = new BigNumber(decoded[3]).shiftedBy(-18).toNumber();
    const amountAMin = new BigNumber(decoded[4]).shiftedBy(-18).toNumber();
    const amountBMin = new BigNumber(decoded[5]).shiftedBy(-18).toNumber();
    const to = this.utilServ.exgToFabAddress(decoded[6]);
    const deadline = this.timeConverter(decoded[7]);
    return '<div>' 
    + '<div class="row"><div class="col col-md-4">Method</div><div class="col col-md-8">Add Liquidity</div></div>'
    + '<div class="row"><div class="col col-md-4">TokenA</div><div class="col col-md-8">' + tokenA + '</div></div>'
    + '<div class="row"><div class="col col-md-4">TokenB</div><div class="col col-md-8">' + tokenB + '</div></div>'
    + '<div class="row"><div class="col col-md-4">AmountADesired</div><div class="col col-md-8">' + amountADesired + '</div></div>'
    + '<div class="row"><div class="col col-md-4">AmountBDesired</div><div class="col col-md-8">' + amountBDesired + '</div></div>'
    + '<div class="row"><div class="col col-md-4">AmountAMin</div><div class="col col-md-8">' + amountAMin + '</div></div>'
    + '<div class="row"><div class="col col-md-4">AmountBMin</div><div class="col col-md-8">' + amountBMin + '</div></div>'
    + '<div class="row"><div class="col col-md-4">To</div><div class="col col-md-8">' + to + '</div></div>'
    + '<div class="row"><div class="col col-md-4">Deadline</div><div class="col col-md-8">' + deadline + '</div></div>'
    + '</div>';
  }

  showSwapExactTokensForTokensData(body) {
    const decoded = this.web3Serv.decodeParameters(
      ['uint256', 'uint256', 'uint32[]', 'address', 'uint256'], 
      body);
    const amountIn =  new BigNumber(decoded[0]).shiftedBy(-18).toNumber();
    const amountOutMin = new BigNumber(decoded[1]).shiftedBy(-18).toNumber();
    let path =  decoded[2].map(item => this.coinServ.getCoinNameByTypeId(item)).toString();
    const to = this.utilServ.exgToFabAddress(decoded[3]);
    const deadline = this.timeConverter(decoded[4]);
    return '<div>' 
    + '<div class="row"><div class="col col-md-4">Method</div><div class="col col-md-8">SwapExactTokensForTokens</div></div>'
    + '<div class="row"><div class="col col-md-4">AmountIn</div><div class="col col-md-8">' + amountIn + '</div></div>'
    + '<div class="row"><div class="col col-md-4">AmountOutMin</div><div class="col col-md-8">' + amountOutMin + '</div></div>'
    + '<div class="row"><div class="col col-md-4">Path</div><div class="col col-md-8">' + path + '</div></div>'
    + '<div class="row"><div class="col col-md-4">To</div><div class="col col-md-8">' + to + '</div></div>'
    + '<div class="row"><div class="col col-md-4">Deadline</div><div class="col col-md-8">' + deadline + '</div></div>'
    + '</div>';
  }

  showSwapTokensForExactTokensData(body) {
    const decoded = this.web3Serv.decodeParameters(
      ['uint256', 'uint256', 'uint32[]', 'address', 'uint256'], 
      body);
    const amountOut =  new BigNumber(decoded[0]).shiftedBy(-18).toNumber();
    const amountInMax = new BigNumber(decoded[1]).shiftedBy(-18).toNumber();
    let path =  decoded[2].map(item => this.coinServ.getCoinNameByTypeId(item)).toString();
    const to = this.utilServ.exgToFabAddress(decoded[3]);
    const deadline = this.timeConverter(decoded[4]);
    return '<div>' 
    + '<div class="row"><div class="col col-md-4">Method</div><div class="col col-md-8">SwapTokensForExactTokens</div></div>'
    + '<div class="row"><div class="col col-md-4">amountOut</div><div class="col col-md-8">' + amountOut + '</div></div>'
    + '<div class="row"><div class="col col-md-4">AmountInMax</div><div class="col col-md-8">' + amountInMax + '</div></div>'
    + '<div class="row"><div class="col col-md-4">Path</div><div class="col col-md-8">' + path + '</div></div>'
    + '<div class="row"><div class="col col-md-4">To</div><div class="col col-md-8">' + to + '</div></div>'
    + '<div class="row"><div class="col col-md-4">Deadline</div><div class="col col-md-8">' + deadline + '</div></div>'
    + '</div>';
  }

  showData(data:string) {
    if(!data) {
      return '';
    }
    const method = data.substring(0, 10);
    const body = data.substring(10);
    switch(method) {
      case '0xbbf5eda1':
        return this.showAddLiquidityData(body);
      case '0x5330901b':
        return this.showSwapExactTokensForTokensData(body);
      case '0xaf91aa50':
        return this.showSwapTokensForExactTokensData(body);
    }
    return data;
  }

  async approveSession(approved) {
    await this.handleSessionUserApproval(approved, this.proposal); // described in the step 4
  }

  onConfirmedPin(pin: string) {
    this.pin = pin;
    const pinHash = this.utilServ.SHA256(pin).toString();
    if (pinHash !== this.wallet.pwdHash) {

        this.alertServ.openSnackBar(this.translateServ.instant('Your password is invalid.'), this.translateServ.instant('Ok'));
        return;
    }

    this.handleRequestDo();


  }

  async handleRequestDo() {
    console.log('handleRequestDo start');
    const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, this.pin);
    

    let result = [];
    const method = this.request.method;
    const params = this.request.params;
    if(this.connectedChainId == this.kanbanChainId) {
      const keyPair = this.coinServ.getKeyPairs(this.wallet.excoin, seed, 0, 0);

      if(method == 'kanban_sendTransaction') {
        console.log('kanban_sendTransaction start');
        let nonce = await this.kanbanServ.getTransactionCount(keyPair.address);
        for(let i = 0; i < params.length; i++) {
          const param = params[i];
          const to = param.to;
          //let nonce = param.nonce;

          /*
          if(!nonce && (nonce !== 0)) {
            nonce = await this.kanbanServ.getTransactionCount(keyPair.address);
          }
          */

          const value = param.value;
          const data = param.data;
          const gasPrice = param.gasPrice;
          const gasLimit = param.gasLimit;
          const txhex = await this.web3Serv.signAbiHexWithPrivateKey(data, keyPair, to, nonce++, value);
          const resp = await this.kanbanServ.sendRawSignedTransactionPromise(txhex);
          console.log('resp===', resp);
          if (resp) {
            console.log('resp for post====', resp);
            if(resp.transactionHash) {
              result.push(resp.transactionHash);
            } else {
              console.log('errorMessage===', resp.errMsg);
              return this.alertServ.openSnackBar(this.translateServ.instant('Error'), resp.errMsg);
            }
          }
        }
      } else 
      if(method == 'personal_sign') {
        const data = params[0];
        const address = params[1];
        const privKey = Buffer.from(keyPair.privateKeyHex, 'hex');
        const sign = this.web3Serv.signKanbanMessageWithPrivateKey(data, privKey);
  
        result.push(sign.signature);
      }
    } else
    if(this.connectedChainId == this.ethChainId) {
      const keyPair = this.coinServ.getKeyPairs(this.ethCoin, seed, 0, 0);
      if(method == 'eth_sendTransaction') {
        //let nonce = await this.apiServ.getEthNonce(this.ethAddress);
        for(let i = 0; i < params.length; i++) {
          const param = params[i];
          let nonce = param.nonce;
          if(!nonce) {
            nonce = await this.apiServ.getEthNonce(this.ethAddress);
          }
          const to = param.to;
          const value = param.value;
          const data = param.data;
  
          console.log('param=', param);
          const gasPrice = param.gasPrice;
          const gasLimit = param.gasLimit;
          //const txhex = await this.web3Serv.signAbiHexWithPrivateKey(data, keyPair, to, nonce ++ , value);

          const txParams = {
            nonce: nonce,
            gasPrice: gasPrice ?? ('0x' + new BigNumber(environment.chains.ETH.gasPrice).shiftedBy(9).toString(16)),
            gasLimit: gasLimit ?? environment.chains.ETH.gasLimitToken,
            to,
            value,
            data
          };

          const txhex = await this.web3Serv.signTxWithPrivateKey(txParams, keyPair);  


          const retEth = await this.apiServ.postEthTx(txhex);
          if (retEth) {
            if(retEth.txHash) {
              result.push(retEth.txHash.trim());
            } else {
              return this.alertServ.openSnackBar(this.translateServ.instant('Error'), retEth.errMsg);
            }
            
          }
        }
      }
    } else
    if(this.connectedChainId == this.bnbChainId) {
      const keyPair = this.coinServ.getKeyPairs(this.bnbCoin, seed, 0, 0);
      if(method == 'eth_sendTransaction') {
        //let nonce = await this.apiServ.getEtheruemCampatibleNonce('BNB', this.ethAddress);
        for(let i = 0; i < params.length; i++) {
          const param = params[i];
          let nonce = param.nonce;
          if(!nonce) {
            nonce = await this.apiServ.getEthNonce(this.ethAddress);
          }
          const to = param.to;
          const value = param.value;
          const data = param.data;
          const gasPrice = param.gasPrice;
          const gasLimit = param.gasLimit;
  
          //const txhex = await this.web3Serv.signAbiHexWithPrivateKey(data, keyPair, to, nonce ++ , value);

          const txParams = {
            nonce: nonce,
            gasPrice: gasPrice ?? ('0x' + new BigNumber(environment.chains.ETH.gasPrice).shiftedBy(9).toString(16)),
            gasLimit: gasLimit ?? environment.chains.BNB.gasLimitToken,
            to,
            value,
            data
          };

          const txhex = await this.web3Serv.signEtheruemCompatibleTxWithPrivateKey('BNB', txParams, keyPair);  

          const retBnb = await this.apiServ.postEtheruemCompatibleTx('BNB', txhex);
          console.log('retBnb===', retBnb);
          if (retBnb) {
            if(retBnb.txHash) {
              result.push(retBnb.txHash.trim());
            } else {
              return this.alertServ.openSnackBar(this.translateServ.instant('Error'), retBnb.errMsg);
            }
            
          }
        }
      }
    }


    const topic = this.topic;
    const response = {
      topic,
      response: {
        id: this.id,
        jsonrpc: "2.0",
        result,
      },
    };

    if(result && (result.length > 0)) {
      this.changeState('sessionRequestApproved');
      return await this.web3wallet.respondSessionRequest(response);
    } else {
      return this.alertServ.openSnackBar(this.translateServ.instant('Error'), "Error while sending transaction");
    }

  }

  approveRequest() {
    this.cd.detectChanges();
    this.pinModal.show();
  }

  async rejectRequest() {
    /*
    console.log('rejectRequest start');
    console.log('this.web3wallet===', this.web3wallet);
    const topic = this.topic;
    const request = this.request;
    console.log('this.proposal.id==', this.proposal.id);
    this.changeState('sessionRequestRejected');
    return await this.web3wallet.rejectSession({
      id: this.proposal.id,
      reason: getSdkError("USER_REJECTED")
    });
    */
    this.disconnect();
  }

  async connect() {

    try {
      if(this.web3wallet) {
        this.web3wallet.killSession();
      }
    } catch(e) {}

    const core = new Core({
      projectId: '3acbabd1deb4672edfd4ca48226cfc0f'
      //relayUrl: 'wss://api.biswap.com',
    })
    
    const web3wallet = await Web3Wallet.init({
      core, // <- pass the shared `core` instance
      metadata: {
        name: 'Exchangily app',
        description: 'Exchangily wallet',
        url: 'www.exchangily.com',
        icons: []
      }
    })

    this.web3wallet = web3wallet;

    if(this.web3wallet) {
      this.web3wallet.on('session_proposal', proposal => this.onSessionProposal(proposal));
      this.web3wallet.on('session_request', request => this.onSessionRequest(request));
      this.web3wallet.on('session_delete', args => this.onSessionDelete(args));
    }


    const pairBody = { uri: this.uri };
    this.web3wallet.core.pairing.pair(pairBody);

  }

  async handleSessionUserApproval(
    approved: boolean,
    proposal: any
  ) {
    if (approved) {
      const approvedNamespaces = buildApprovedNamespaces({
        proposal: this.params,
        supportedNamespaces: {
          eip155: {
            chains: [
              'eip155:' + this.ethChainId, 
              'eip155:' + this.bnbChainId, 
              'eip155:' + this.maticChainId, 
              'eip155:' + this.kanbanChainId
            ],
            methods: [
              'eth_sendTransaction', 
              'eth_signTransaction', 
              'personal_sign',
              'eth_sign',
              "kanban_sendTransaction",
              "personal_sign"
            ],

            events: ['accountsChanged', 'chainChanged'],
            accounts: [
              'eip155:' + this.ethChainId + ':' + this.ethAddress,
              'eip155:' + this.bnbChainId + ':' + this.ethAddress,
              'eip155:' + this.maticChainId + ':' + this.ethAddress,
              'eip155:' + this.kanbanChainId +':' + this.walletAddress
            ]
          }
        }
      })

      console.log('approvedNamespaces====', approvedNamespaces);
      const apprvedResult = await this.web3wallet.approveSession({
        id: this.id,
        //relayProtocol: this.relays[0].protocol,
        namespaces: approvedNamespaces
      })
      console.log('apprvedResult===', apprvedResult);
      this.changeState('sessionCreated');
    } else {
      // if user didn't approve then reject with no response
      await this.web3wallet.reject({ proposal });
    }
  }
}
