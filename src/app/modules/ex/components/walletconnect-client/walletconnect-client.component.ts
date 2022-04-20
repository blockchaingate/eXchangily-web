import { Component, TemplateRef, OnInit } from '@angular/core';
import WalletConnectClient from "@walletconnect/client";
import BigNumber from 'bignumber.js';
import { CLIENT_EVENTS } from "@walletconnect/client";
import { PairingTypes } from "@walletconnect/types";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { Web3Service } from 'src/app/services/web3.service';
import { KanbanService } from 'src/app/services/kanban.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
    selector: 'app-walletconnect-client',
    templateUrl: './walletconnect-client.component.html',
    styleUrls: ['./walletconnect-client.component.scss']
  })
  export class WalletconnectClientComponent implements OnInit {
      chainId: number;
      account: string;
      to: string;
      toExample: string;
      dataExample: string;
      value: number;
      data: string;
      session: any;
      txid: string;
      client: any;
      uri: string;

      constructor(
        private web3Serv: Web3Service, 
        private utilServ: UtilService,
        private kanbanServ: KanbanService) {

      }
      async ngOnInit() { 
        this.value = 0;

        this.data = this.dataExample = this.web3Serv.getTransferFuncABI(196609, this.utilServ.fabToExgAddress('mjHedtvkkkNxhxB4eKLHxwVinR3Tt7WzHf'), 0.1);

        this.to = this.toExample = await this.kanbanServ.getCoinPoolAddress();

        if(!this.client) {
          this.client = await WalletConnectClient.init({
            logger: 'debug',
            projectId: "3acbabd1deb4672edfd4ca48226cfc0f",
            relayUrl: "wss://relay.walletconnect.com",
            metadata: {
              name: "Example Dapp",
              description: "Example Dapp",
              url: "http://localhost:4200",
              icons: ["https://walletconnect.com/walletconnect-logo.png"],
            },
          });
        }

      }

      async showQrCode() {

        this.client.on(
          CLIENT_EVENTS.pairing.proposal,
          async (proposal: PairingTypes.Proposal) => {
            // uri should be shared with the Wallet either through QR Code scanning or mobile deep linking
            console.log('hahha');
            const { uri } = proposal.signal.params;
            console.log('uri====', uri);
            this.uri= uri;
            console.log("EVENT", "QR Code Modal opened");
            QRCodeModal.open(uri, () => {
              console.log("EVENT", "QR Code Modal closed");
            });
          }
        );

        const session = await this.client.connect({
          permissions: {
            
            blockchain: {
              chains: ["eip155:fab"],
            },
            jsonrpc: {
              methods: ["kanban_sendTransaction"],
            },
          },
        });

        this.onSessionConnected(session);
      }

      onSessionConnected(session) {
        this.session = session;
        console.log('sessionnnn=', session);
        QRCodeModal.close();
        const accounts = session.state.accounts;
        console.log('accounts===', accounts);
        if(accounts && (accounts.length > 0)) {
          this.account = accounts[0];
          console.log('this.account=', this.account);
        }
      }

      async send() {

        const tx = {
          to: this.to,
          value: this.value,
          data: this.data
        };
        const requestBody = {
          topic: this.session.topic,
          chainId: this.session.permissions.blockchain.chains[0],
          request: {
            method: "kanban_sendTransaction",
            params: [tx],
          },
        };

        console.log('requestBody===', requestBody);
        const result = await this.client.request(requestBody);

        console.log('result===', result);
      }
  }

  /*
  body= 
Object
chainId: "eip155:1"
request: {method: 'personal_sign', params: Array(2)}
topic: "0c2cca65d1a286e32b1b7e893ca5b789fecf2a3a9cbb339269b21448f6cca76e"
[[Prototype]]: Object
  */