import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { HttpService } from '../../services/http.service';
import * as exaddr from '../../lib/exaddr';
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

    changeListenerEvent(event: any) {
        const files = event.target.files;
        this.changeListener(files);
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
            if((headers[0] != 'Address') && (headers[0] != 'address')) {
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
                    coinsMap[coinName] = {amount:Number(data[1].trim())};
                    if(data[2].trim()) {
                        coinsMap[coinName]['lockPeriodOfBlockNumber'] = Number(data[2].trim())
                    };
                } catch(e) {

                }
                if(coinsMap[coinName]['amount'] < 0) {
                    this.alertServ.openSnackBar('Amount ' + data[1].trim() + ' is invalid', 'Ok');
                    return;                    
                }
                let address = data[0].replace(/\"/g, '');
                address = address.trim();

                console.log('address====', address);
                if(!address) {
                    continue;
                }

                let exgAddress = '';
                if(address.trim().length == 40) {
                    address = '0x' + address.trim();
                }
                if(address.indexOf('0x') < 0) {
                    let newAddress = address;
                    if(newAddress.indexOf('o') === 0 || newAddress.indexOf('K') === 0) {
                        newAddress = exaddr.toLegacyAddress(newAddress);
                    } 
                    try {
                        exgAddress = this.utilServ.fabToExgAddress(newAddress);
                    } catch(e) {
    
                    }
                } else {
                    exgAddress = address;
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