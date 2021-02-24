import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-bulk-transfer',
  templateUrl: './bulk-transfer.component.html',
  styleUrls: ['./bulk-transfer.component.scss']
})
export class BulkTransferComponent implements OnInit {
    preview: boolean;
    accounts: any;
    balances: string;
    constructor(private httpServ: HttpService) {
    }
    ngOnInit() {
        this.preview = false;
    }

    previewDo() {
        this.accounts = JSON.parse(this.balances);
        this.preview = true;
    }

    springFestival() {
        const fromTimestamp = 1612846800;
        const toTimeStamp = 1613624400;
        let url = environment.endpoints.kanban + 'tradesbetweentimestamps/' + fromTimestamp + '/' + toTimeStamp;
        this.httpServ.getRaw(url).subscribe(
            (res) => {
                console.log('res==', res);
            }
        );
    }
}