import { Component, TemplateRef, OnInit } from '@angular/core';
import WalletConnectClient from "@walletconnect/client";
import BigNumber from 'bignumber.js';
import { CLIENT_EVENTS } from "@walletconnect/client";
import { PairingTypes } from "@walletconnect/types";
import QRCodeModal from "@walletconnect/qrcode-modal";

@Component({
    selector: 'app-walletconnect-client',
    templateUrl: './walletconnect-client.component.html',
    styleUrls: ['./walletconnect-client.component.scss']
  })
  export class WalletconnectClientComponent implements OnInit {
      chainId: number;
      account: string;
      to: string;
      amount: number;
      session: any;
      txid: string;
      client: any;
      uri: string;
      async ngOnInit() {
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
              chains: ["eip155:kanban"],
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
        const requestBody = {
          topic: this.session.topic,
          chainId: this.session.permissions.blockchain.chains[0],
          request: {
            method: "personal_sign",
            params: [
              "0x4d7920656d61696c206973206a6f686e40646f652e636f6d202d2031363530333832303833363939",
              "0xA5488e4319DF76377e2aD454CcBcaE37a93c7B48"            ],
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