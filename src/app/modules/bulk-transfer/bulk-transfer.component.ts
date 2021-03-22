import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { environment } from '../../../environments/environment';
import { Observable, forkJoin } from 'rxjs';

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

    importCSV() {

    }

    changeListener(files: FileList){
    console.log(files);
    if(files && files.length > 0) {
        let file : File = files.item(0); 

        let reader: FileReader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
            this.accounts = {};
            let csv: string = reader.result as string;
            //console.log(csv);

            const list = csv.split('\n');
            const headers = list[0].split(',');
            if(headers[0] != 'Address') {
                return;
            }
            const coinName = headers[1].trim();

            for(let i = 1; i < list.length; i++) {
                const item = list[i];
                const data = item.split(',');
                const coinsMap = {};
                coinsMap[coinName] = Number(data[1].trim());
                this.accounts[data[0]] = coinsMap;
            }

            
            //this.accounts = JSON.stringify(this.accounts);
            console.log('this.accounts==', this.accounts);
            this.preview = true;
            /*
            list.forEach( e => {
            this.covidData.push(e);
            }); 
            */           
        }
        }
    }
}