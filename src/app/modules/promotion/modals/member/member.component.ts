import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'member-modal',
    templateUrl: './member.component.html',
    styleUrls: ['./member.component.css']
})
export class MemberModal implements OnInit {
    @Input() members: any;
    @ViewChild('memberModal', { static: true }) public memberModal: ModalDirective = {} as ModalDirective;

    constructor() {
    }

    ngOnInit() {
    }

    show() {
        this.memberModal.show();
    }
    hide() {
        this.memberModal.hide();
    }
}