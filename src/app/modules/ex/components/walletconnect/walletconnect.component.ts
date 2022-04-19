import { Component, OnInit } from '@angular/core'; 
import WalletConnectClient from '@walletconnect/client'
import WalletConnect from "@walletconnect/client";
import { CLIENT_EVENTS } from "@walletconnect/client";
import { SessionTypes } from "@walletconnect/types";

@Component({
  selector: 'app-walletconnect',
  templateUrl: './walletconnect.component.html',
  styleUrls: ['./walletconnect.component.css']
})
export class WalletconnectComponent implements OnInit {
  client: any;
  uri: string;
  constructor() { }

  ngOnInit(): void {
  }

  async connect() {

    const client = await WalletConnectClient.init({
      controller: true,
      //logger: 'debug',
      projectId: "3acbabd1deb4672edfd4ca48226cfc0f",
      relayUrl: "wss://relay.walletconnect.com",
      metadata: {
        name: "Example Dapp",
        description: "Example Dapp",
        url: "http://localhost:4200",
        icons: ["https://walletconnect.com/walletconnect-logo.png"],
      },
    });

    this.client = client;
    client.on(
      CLIENT_EVENTS.session.proposal,
      async (proposal: SessionTypes.Proposal) => {
        console.log('proposalllll=', proposal);
        // user should be prompted to approve the proposed session permissions displaying also dapp metadata
        const { proposer, permissions } = proposal;
        console.log('proposer=', proposer);
        console.log('permissions=', permissions);
        const { metadata } = proposer;
        let approved: boolean;
        this.handleSessionUserApproval(approved, proposal); // described in the step 4
      }
    );

    client.on(
      CLIENT_EVENTS.session.created,
      async (session: SessionTypes.Created) => {
        // session created succesfully
        console.log('session created');
      }
    );
    const pairBody = { uri: this.uri };
    console.log('pairBody=', pairBody);
    client.pair(pairBody);

  }

  async handleSessionUserApproval(
    approved: boolean,
    proposal: SessionTypes.Proposal
  ) {
    console.log('handleSessionUserApproval');
    const userApproved = true;
    if (userApproved) {
      console.log('apprrrrrroved');
      // if user approved then include response with accounts matching the chains and wallet metadata
      const response = {
        state: {
          accounts: ["eip155:kanban:0x1d85568eEAbad713fBB5293B45ea066e552A90De"],
        },
      };
      await this.client.approve({ proposal, response });
    } else {
      // if user didn't approve then reject with no response
      await this.client.reject({ proposal });
    }
  }
}
