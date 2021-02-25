import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { environment } from '../../../../environments/environment';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-spring',
  templateUrl: './spring.component.html',
  styleUrls: ['./spring.component.scss']
})
export class SpringComponent implements OnInit {
    preview: boolean;
    accounts: any;
    balances: string;
    constructor(private httpServ: HttpService) {
    }
    ngOnInit() {
        this.preview = false;
        this.springFestival();
    }

    async springFestival() {
        const fromTimestamp = 1612846800;
        const toTimeStamp = 1613624400;
        const promises = [];
        const url1 = environment.endpoints.kanban + 'tradesbetweentimestamps/' + fromTimestamp + '/' + toTimeStamp;
        promises.push(this.httpServ.getRaw(url1));

        const url2 = environment.endpoints.kanban + 'getdepositsbetween/' + fromTimestamp + '/' + toTimeStamp;
        promises.push(this.httpServ.getRaw(url2));
        
        const url3 = environment.endpoints.kanban + 'getwithdrawsbetween/' + fromTimestamp + '/' + toTimeStamp;
        promises.push(this.httpServ.getRaw(url3));


        forkJoin([this.httpServ.getRaw(url1), this.httpServ.getRaw(url2), this.httpServ.getRaw(url3)])
        .subscribe((results: any) => {
            // results[0] is our character
            // results[1] is our character homeworld
            console.log('results=', results);
            const trades = results[0];
            const deposits = results[1].data;
            const withdraws = results[2].data;

            console.log('trades=', trades);
            console.log('deposits==', deposits);
            console.log('withdraws==', withdraws);
          });
    }    
}