import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core'; 
import WalletConnectClient from '@walletconnect/client';
import { CLIENT_EVENTS } from "@walletconnect/client";
import { SessionTypes } from "@walletconnect/types";
import { UtilService } from 'src/app/services/util.service';
import { WalletService } from 'src/app/services/wallet.service';
import { ERROR, getAppMetadata } from "@walletconnect/utils";
import { Web3Service } from 'src/app/services/web3.service';
import { KanbanService } from 'src/app/services/kanban.service';
import { PinNumberModal } from '../../../shared/modals/pin-number/pin-number.modal';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { CoinService } from 'src/app/services/coin.service';

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
  wallet: any;
  permissions: any;
  metadata: any;
  request: any;
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
    console.log('changeState=', newState);
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

    const client = await WalletConnectClient.init({
      controller: true,
      //logger: 'debug',
      projectId: "3acbabd1deb4672edfd4ca48226cfc0f",
      relayUrl: "wss://relay.walletconnect.com",
      metadata: {
        name: "Example Dapp in wallet connect",
        description: "Example Dapp in wallet connect",
        url: "http://localhost:4200",
        icons: ["https://walletconnect.com/walletconnect-logo.png"],
      },
    });

    this.client = client;
    this.client.on(
      CLIENT_EVENTS.session.proposal,
      async (proposal: SessionTypes.Proposal) => {
        console.log('proposalllll=', proposal);
        // user should be prompted to approve the proposed session permissions displaying also dapp metadata
        const { proposer, permissions } = proposal;
        this.proposal = proposal;
        console.log('proposer=', proposer);
        console.log('permissions=', permissions);
        const { metadata } = proposer;
        this.metadata = metadata;
        this.permissions = permissions;
        console.log('metadata===', metadata);
        this.changeState('sessionProposal');

      }
    );

    this.client.on(
      CLIENT_EVENTS.session.created,
      async (session: SessionTypes.Created) => {
        this.session = session;
        this.changeState('sessionCreated');
      }
    );

    this.client.on(
      CLIENT_EVENTS.session.request,
      async (requestEvent: SessionTypes.RequestEvent) => {
        // WalletConnect client can track multiple sessions
        // assert the topic from which application requested
        const { topic, request } = requestEvent;
        console.log('request===', request);
        const session = await client.session.get(requestEvent.topic);
        // now you can display to the user for approval using the stored metadata
        const { metadata } = session.peer;
        console.log('metadata for sessionRequest', metadata);
        // after user has either approved or not the request it should be formatted
        // as response with either the result or the error message
        this.topic = topic;
        console.log('topic===', topic);
        this.request = request;
        console.log('request===', request);
        this.changeState('sessionRequest');


      }
    );
  }

  async disconnect() {
    if(this.client) {
      this.changeState('noSession');
      await this.client.disconnect({
        topic: this.session.topic,
        reason: ERROR.USER_DISCONNECTED.format(),
      })
    }

  }

  approveSession(approved) {
    this.handleSessionUserApproval(approved, this.proposal); // described in the step 4
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
    const request = this.request;
    const response = {
      topic,
      response: {
        id: request.id,
        jsonrpc: "2.0",
        result,
      },
    };

    return await this.client.respond(response);
  }
  approveRequest() {
    console.log('handleRequest go');
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
    return await this.client.respond(response);

  }
  connect() {

    const pairBody = { uri: this.uri };
    console.log('pairBody=', pairBody);
    this.client.pair(pairBody);

  }

  async handleSessionUserApproval(
    approved: boolean,
    proposal: SessionTypes.Proposal
  ) {
    console.log('handleSessionUserApproval');
    if (approved) {
      console.log('apprrrrrroved');
      // if user approved then include response with accounts matching the chains and wallet metadata
      const response = {
        state: {
          accounts: ["eip155:fab:" + this.walletAddress],
        },
      };
      await this.client.approve({ proposal, response });
    } else {
      // if user didn't approve then reject with no response
      await this.client.reject({ proposal });
    }
  }
}
