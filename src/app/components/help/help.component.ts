import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TicketCat } from '../../models/ticket-cat';
import { Ticket } from '../../models/ticket';
// import { UserAuth } from './landing/service/user-auth/user-auth.service';
import { UserAuth } from '../../modules/landing/service/user-auth/user-auth.service';
import { TicketService } from '../../services/ticket.service';
import { StorageService } from '../../services/storage.service';

@Component({
    selector: 'app-help',
    templateUrl: './help.component.html',
    styleUrls: ['./help.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HelpComponent implements OnInit {
    selectedCat = -1;
    email: string;
    title: string;
    desc: string;
    token: string;

    success = false;
    ticketId: string;
    toShort = false;
    catselected = true;
    logIn = true;
    errMsg: string;

    constructor(private _ticketServ: TicketService, private storageService: StorageService, private _userAuth: UserAuth) { }

    ngOnInit() {
        /* this._ticketServ.getTicketCats().subscribe(ret => {
            this.ticketCats = <[TicketCat]>ret; alert(JSON.stringify(this.ticketCats)); 
        });
        */
    }

    selectCat(catId) {
        this.selectCat = catId;
    }

    submit() {

        this._userAuth.isLoggedIn$.subscribe((value: string) => {
            console.log('value: ' + value);
            this.logIn = value ? true : false;
            // alert(this.loggedIn);

            console.log('selectedCat: ' + this.selectedCat + 'title: ' + this.title + 'desc: ' + this.desc);


            //   const ticket = { catId: this.selectedCat, title: this.title, desc: this.desc };
            const ticket = { catId: this.selectedCat, email: this.email, title: this.title, content: this.desc, memberId: value };
            if (this.selectedCat === -1) {
                this.catselected = false;
                return;
            }

            this.catselected = true;

            if (!this.title || this.title.length < 10 || !this.desc || this.desc.length < 20) {
                this.toShort = true;
                return;
            }
            this.toShort = false;

            this.storageService.getToken().subscribe(
                (token: string) => {
                    this.token = token;
                    console.log('token==', token);
                    if (!token) {
                        this.logIn = false;
                        this.success = false;
                    } else {
                        this._ticketServ.createTicket(ticket, this.token).subscribe(ret => {
                            this.success = true;
                            this.logIn = true;
                            this.ticketId = ret['_id'];
                        },
                            err => {
                                this.errMsg = JSON.stringify(err);
                                this.logIn = true;
                                this.success = false;
                            });
                    }
                });
        });
    }

}
