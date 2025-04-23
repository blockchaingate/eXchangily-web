import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AirdropService } from '../../../../services/airdrop.service';
import { AlertService } from '../../../../services/alert.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'get-free-fab-modal',
    templateUrl: './get-free-fab.modal.html',
    styleUrls: ['./get-free-fab.modal.scss']
})
export class GetFreeFabModal implements OnInit {
    @ViewChild('getFreeFabModal', { static: true }) public getFreeFabModal: ModalDirective;
    @Input() address: string;
    question: string;
    questionair_id: string;
    answer: string;
    error: string | null;
    publicIP: string;
    constructor(private airdropServ: AirdropService, private alertServ: AlertService, private http: HttpClient) {

    }

    ngOnInit() {
        this.http.get('https://api.ipify.org?format=json').toPromise().then((data: any) => {
            this.publicIP = data['ip'];
        });
    }

    onSubmit() {
        this.airdropServ.answerQuestionair(this.address, this.questionair_id, this.answer).subscribe(
            (res: any) => {
                if (res) {
                    if (res.ok) {
                        this.hide();
                        return this.alertServ.openSnackBarSuccess('Congrat, you will get free Gas shortly', 'Ok');
                    }
                    return this.alertServ.openSnackBar(res._body, 'Ok');
                }

            }
        );
    }

    show() {
        this.error = null;
        this.airdropServ.getQuestionair(this.address, this.publicIP).toPromise().then(
            (res: any) => {
                if (res) {
                    const data = res._body;
                    if (res.ok) {

                        console.log('data=', data);
                        this.question = data.question;
                        this.questionair_id = data._id;
                    } else {
                        this.error = data;
                    }

                }
            }
        );
        this.getFreeFabModal.show();
    }
    hide() {
        this.getFreeFabModal.hide();
    }
}
