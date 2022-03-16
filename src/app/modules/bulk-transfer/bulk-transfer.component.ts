import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { environment } from '../../../environments/environment';
import { Observable, forkJoin } from 'rxjs';
import { UtilService } from '../../services/util.service';
import { AlertService } from '../../services/alert.service';
@Component({
  selector: 'app-bulk-transfer',
  templateUrl: './bulk-transfer.component.html',
  styleUrls: ['./bulk-transfer.component.scss']
})
export class BulkTransferComponent implements OnInit {
    preview: boolean;
    accounts: any;
    balances: string;
    constructor(private alertServ: AlertService, private utilServ: UtilService, private httpServ: HttpService) {
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

                
                if(!item) {
                    continue;
                }
                
                //console.log('item=', item);
                const data = item.split(',');
                
                if(!data || (data.length < 2)) {
                    continue;
                }
                
                //console.log('data=', data);
                const coinsMap = {};
                try {
                    coinsMap[coinName] = Number(data[1].trim());
                } catch(e) {

                }
                if(!coinsMap[coinName] || coinsMap[coinName] <= 0) {
                    this.alertServ.openSnackBar('Amount ' + data[1].trim() + ' is invalid', 'Ok');
                    return;                    
                }
                const address = data[0].replace(/\"/g, '');
                console.log('address====', address);
                let exgAddress = '';
                try {
                    exgAddress = this.utilServ.fabToExgAddress(address);
                } catch(e) {

                }
                if(address.indexOf('19Txgh32N16g4sWiZ9JnzoVXQxxqAk4wC') == 0) {
                    console.log('address=====', address);
                    console.log('exgAddress=====', exgAddress);
                }
                if(!exgAddress || (exgAddress.indexOf('0x') != 0) || (exgAddress.length != 42)) {
                    this.alertServ.openSnackBar('Address ' + address + ' is invalid', 'Ok');
                    return;
                }

                this.accounts[address] = coinsMap;
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