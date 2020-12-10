import { Component, OnInit, Renderer2, Inject } from '@angular/core';

@Component({
  selector: 'app-bulk-transfer',
  templateUrl: './bulk-transfer.component.html',
  styleUrls: ['./bulk-transfer.component.scss']
})
export class BulkTransferComponent implements OnInit {
    preview: boolean;
    accounts: any;
    balances: string;
    constructor() {
    }
    ngOnInit() {
        this.preview = false;
        console.log('preview', this.preview);
    }

    previewDo() {
        console.log('this.balances==', this.balances);
        this.accounts = JSON.parse(this.balances);
        console.log('this.accounts=', this.accounts);
        this.preview = true;

    }
}