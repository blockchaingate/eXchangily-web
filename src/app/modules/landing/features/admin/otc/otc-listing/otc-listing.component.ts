import { Component, OnInit, ViewChild } from '@angular/core';
import { StorageService } from '../../../../../../services/storage.service';
import { OtcService } from '../../../../../../services/otc.service';
import { OtcListingOrdersModal } from '../../modals/otc-listing-orders/otc-listing-orders.component';

@Component({
  selector: 'app-otc-listing',
  templateUrl: './otc-listing.component.html',
  styleUrls: ['./otc-listing.component.scss']
})
export class OtcListingComponent implements OnInit {
    listings: any;
    listing: any;
    token = '';
    
    @ViewChild('adminOtcListingOrders', { static: true }) adminOtcListingOrders: OtcListingOrdersModal = {} as OtcListingOrdersModal;

    constructor(
        private otcServ: OtcService, 
        private _storageServ: StorageService        
    ) {}
    ngOnInit() {

        this._storageServ.getToken().subscribe(
            (token: any) => {
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

    openOrdersModal(listing: any) {
        console.log();
        this.adminOtcListingOrders.show(listing);
    }

    toggleActive(listing: any) {
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