import { Component, TemplateRef, OnInit } from '@angular/core';
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import BigNumber from 'bignumber.js';

@Component({
    selector: 'app-walletconnect',
    templateUrl: './walletconnect.component.html',
    styleUrls: ['./walletconnect.component.scss']
  })
  export class WalletconnectComponent implements OnInit {
      chainId: number;
      account: string;
      to: string;
      amount: number;
      connector: WalletConnect;
      txid: string;
      ngOnInit() {
      // Create a connector
      this.to = "0xe68b2d379d398fcc4f2e997e4d2d46de42b4ec70";
      this.amount = 0.01;
        const connector = new WalletConnect({
          bridge: "https://bridge.walletconnect.org", // Required
          qrcodeModal: QRCodeModal,
        });
        
        this.connector = connector;
        // Check if connection is already established
        if (!connector.connected) {
          // create new session
          connector.createSession();
        }
        
        // Subscribe to connection events
        connector.on("connect", (error, payload) => {
          if (error) {
            throw error;
          }
        
          // Get provided accounts and chainId
          const { accounts, chainId } = payload.params[0];

          if(accounts && accounts.length > 0) {
            this.account = accounts[0];
          }
          this.chainId = chainId;
        });
        
        connector.on("session_update", (error, payload) => {
          if (error) {
            throw error;
          }
        
          // Get updated accounts and chainId
          const { accounts, chainId } = payload.params[0];
        });
        
        connector.on("disconnect", (error, payload) => {
          this.account = '';
          this.chainId = 0;

          if (error) {
            throw error;
          }
          //this.connector.killSession();
          this.connector.createSession();
          // Delete connector
        });
      }

      send() {
 // Draft transaction
const tx = {
  from: this.account, // Required
  to: this.to, // Required (for non contract deployments)
  data: "0x0", // Required
  gasPrice: "0x02540be400", // Optional
  gas: "0x9c40", // Optional
  value: new BigNumber(this.amount).multipliedBy(new BigNumber(1e18)).toFixed(), // Optional
};

// Send transaction
this.connector
  .sendTransaction(tx)
  .then((result) => {
    // Returns transaction id (hash)
    console.log(result);
    this.txid = result;
  })
  .catch((error) => {
    // Error returned when rejected
    console.error(error);
  });       
      }
  }
