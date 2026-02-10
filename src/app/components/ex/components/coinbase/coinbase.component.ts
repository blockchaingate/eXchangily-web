import { Component, OnInit } from '@angular/core';
import { initOnRamp } from '../../../../cbpay-js';

@Component({
  selector: 'app-coinbase',
  templateUrl: './coinbase.component.html',
  styleUrls: ['./coinbase.component.css']
})
export class CoinbaseComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {

  }

  connect() {
    const destinationWallets: any = [
      {
        address: '0xabc123',
        blockchains: ['ethereum', 'avalanche-c-chain'],
      },
    ];
    
    const instance = initOnRamp({
      target: '#button-container',
      appId: '6a6b1793-0892-4889-b6ae-a193fe650321',
      widgetParameters: {
        destinationWallets,
      },
      onExit: () => {
        alert('On Exit');
      },
      onSuccess: () => {
        alert('On Success');
      },
      onEvent: (metadata) => {
        console.log(metadata);
      },
      closeOnExit: true,
      closeOnSuccess: true,
      embeddedContentStyles: {
        top: '100px',
        width: '50%',
      },
    });

    instance.open();
  }
}
