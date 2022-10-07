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

@Component({
  selector: 'app-walletconnect',
  templateUrl: './walletconnect.component.html',
  styleUrls: ['./walletconnect.component.css']
})
export class WalletconnectComponent implements OnInit {
  client: any;
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
  @ViewChild('pinModal', { static: true }) pinModal: PinNumberModal;

  constructor(
    private web3Serv: Web3Service,
    private translateServ: TranslateService,
    private kanbanServ: KanbanService,
    private coinServ: CoinService,
    private alertServ: AlertService,
    private cd: ChangeDetectorRef,
    private utilServ: UtilService,
    private walletServ: WalletService) { }

  changeState(newState: string) {
    this.state = newState;
    this.cd.detectChanges();
  }
  async ngOnInit() {
    this.changeState('noSession');
    const wallet = await this.walletServ.getCurrentWallet();
    if (wallet) {
      this.wallet =wallet;
        const address = wallet.excoin.receiveAdds[0].address;
        this.walletAddress = this.utilServ.exgToFabAddress(address);
    }

    const client = await SignClient.init({
      projectId: "3acbabd1deb4672edfd4ca48226cfc0f",    
      relayUrl: 'wss://relay.walletconnect.com',
      metadata: {
        name: 'Angular Wallet',
        description: 'Angular Wallet for WalletConnect',
        url: 'https://walletconnect.com/',
        icons: ['https://avatars.githubusercontent.com/u/37784886']
      }
    });

    this.client = client;

    client.on('session_proposal', proposal => this.onSessionProposal(proposal))
    client.on('session_request', request => this.onSessionRequest(request))
    // TODOs
    client.on('session_ping', data => console.log('ping', data))
    client.on('session_event', data => console.log('event', data))
    client.on('session_update', data => console.log('update', data))
    client.on('session_delete', data => console.log('delete', data))
  }

  async onSessionRequest(requestEvent) {
        console.log('requestEvent===', requestEvent);
        const {id, params, topic} = requestEvent;
        this.id = id;
        const { request } = params;
        
        const session = await this.client.session.get(topic);
        // now you can display to the user for approval using the stored metadata
        const { metadata } = session.peer;
        // after user has either approved or not the request it should be formatted
        // as response with either the result or the error message
        this.topic = topic;
        this.request = request;
        this.changeState('sessionRequest');
    
  }
  onSessionProposal(proposal) {
    const {id, params} = proposal;
    this.id = id;
    const { proposer, requiredNamespaces, relays } = params;
    this.proposal = proposal;
    this.relays = relays;
    this.requiredNamespaces = requiredNamespaces;
    const { metadata } = proposer;
    this.metadata = metadata;
    this.changeState('sessionProposal');
  }

  async disconnect() {
    if(this.client) {
      this.changeState('noSession');
      await this.client.disconnect({
        topic: this.session.topic,
        reason: 'User disconnect',
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
    //console.log('transferDo start');
    const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, this.pin);
    const keyPair = this.coinServ.getKeyPairs(this.wallet.excoin, seed, 0, 0);

    let result = [];
    const method = this.request.method;
    const params = this.request.params;
    let nonce = await this.kanbanServ.getTransactionCount(keyPair.address);
    if(method == 'kanban_sendTransaction') {
      for(let i = 0; i < params.length; i++) {
        const param = params[i];
        const to = param.to;
        const value = param.value;
        const data = param.data;

        const txhex = await this.web3Serv.signAbiHexWithPrivateKey(data, keyPair, to, nonce ++ , value);
        const resp = await this.kanbanServ.sendRawSignedTransactionPromise(txhex);
        if (resp && resp.transactionHash) {
          result.push(resp.transactionHash);
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

    console.log('response for =', response);
    this.changeState('sessionRequestApproved');
    return await this.client.respond(response);
  }
  approveRequest() {
    this.cd.detectChanges();
    this.pinModal.show();
  }

  async rejectRequest() {
    const topic = this.topic;
    const request = this.request;
    const response = {
        topic,
        response: {
          id: request.id,
          jsonrpc: "2.0",
          error: {
            code: -32000,
            message: "User rejected JSON-RPC request",
          },
        },
    };
    this.changeState('sessionRequestRejected');
    return await this.client.respond(response);

  }
  connect() {

    const pairBody = { uri: this.uri };
    console.log('pairBody===', pairBody);
    this.client.pair(pairBody);

  }

  async handleSessionUserApproval(
    approved: boolean,
    proposal: any
  ) {
    if (approved) {
      // if user approved then include response with accounts matching the chains and wallet metadata
      /*
      const response = {
        state: {
          accounts: ["eip155:fab:" + this.walletAddress],
        },
      };
      await this.client.approve({ proposal, response });
      */

      const namespaces: any = {}
      Object.keys(this.requiredNamespaces).forEach(key => {
        const accounts: string[] = ["eip155:fab:" + this.walletAddress];
        namespaces[key] = {
          accounts,
          methods: this.requiredNamespaces[key].methods,
          events: this.requiredNamespaces[key].events
        }
      })

      const apprvedResult = await this.client.approve({
        id: this.id,
        relayProtocol: this.relays[0].protocol,
        namespaces
      })
      console.log('apprvedResult===', apprvedResult);
      this.changeState('sessionCreated');
    } else {
      // if user didn't approve then reject with no response
      await this.client.reject({ proposal });
    }
  }
}
