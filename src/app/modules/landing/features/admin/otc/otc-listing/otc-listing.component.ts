import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../../../../services/storage.service';
import { OtcService } from '../../../../../../services/otc.service';

@Component({
  selector: 'app-otc-listing',
  templateUrl: './otc-listing.component.html',
  styleUrls: ['./otc-listing.component.scss']
})
export class OtcListingComponent implements OnInit {
    listings: any;
    token: string;
    constructor(
        private otcServ: OtcService, 
        private _storageServ: StorageService        
    ) {}
    ngOnInit() {

        this._storageServ.getToken().subscribe(
            (token: string) => {
              this.token = token;        
              this.otcServ.getAllListings(token).subscribe(
                (res: any) => {
                    if(res.ok) {
                        this.listings = res._body;
                    }
                }
              );
        });
    }

    toggleActive(listing) {
        const status = !listing.active;
        this.otcServ.setActive(listing._id, status, this.token).subscribe(
            (res: any) => {
                if(res.ok) {
                    listing.active = status;
                }
            }
          );        
    }
}