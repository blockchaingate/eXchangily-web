import { Component, OnInit } from '@angular/core'; 
import WalletConnectClient from '@walletconnect/client'
import WalletConnect from "@walletconnect/client";
import { CLIENT_EVENTS } from "@walletconnect/client";
import { SessionTypes } from "@walletconnect/types";
import { UtilService } from 'src/app/services/util.service';
import { WalletService } from 'src/app/services/wallet.service';
import { ERROR, getAppMetadata } from "@walletconnect/utils";

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
  request: any;
  walletAddress: string;

  constructor(
    private utilServ: UtilService,
    private walletServ: WalletService) { }

  async ngOnInit() {
    this.state = 'noSession';
    const wallet = await this.walletServ.getCurrentWallet();
    if (wallet) {
        const address = wallet.excoin.receiveAdds[0].address;
        this.walletAddress = this.utilServ.exgToFabAddress(address);
    }
  }

  async disconnect() {
    if(this.client) {
      this.state = 'noSession';
      await this.client.disconnect({
        topic: this.session.topic,
        reason: ERROR.USER_DISCONNECTED.format(),
      })
    }

  }

  approveSession(approved) {
    this.handleSessionUserApproval(approved, this.proposal); // described in the step 4
  }

  async approveRequest(approved) {
    let result: any;
    const topic = this.topic;
    const request = this.request;
    const response = approved
      ? {
          topic,
          response: {
            id: request.id,
            jsonrpc: "2.0",
            result,
          },
        }
      : {
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
    await this.client.respond(response);
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
        this.proposal = proposal;
        console.log('proposer=', proposer);
        console.log('permissions=', permissions);
        const { metadata } = proposer;
        console.log('metadata===', metadata);
        this.state = 'sessionProposal';
        /*
        let approved: boolean;
        
        */
      }
    );

    client.on(
      CLIENT_EVENTS.session.created,
      async (session: SessionTypes.Created) => {
        // session created succesfully
        console.log('session created');
        this.session = session;
        this.state = 'sessionCreated';
        console.log('this.session=', this.session);
      }
    );

    client.on(
      CLIENT_EVENTS.session.request,
      async (requestEvent: SessionTypes.RequestEvent) => {
        // WalletConnect client can track multiple sessions
        // assert the topic from which application requested
        const { topic, request } = requestEvent;
        console.log('request===', request);
        const session = await client.session.get(requestEvent.topic);
        // now you can display to the user for approval using the stored metadata
        const { metadata } = session.peer;
        // after user has either approved or not the request it should be formatted
        // as response with either the result or the error message
        this.state = 'sessionRequest';
        this.topic = topic;
        this.request = request;

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
