import { Component, ViewChild, EventEmitter, Output, OnInit } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'team-modal',
    templateUrl: './team.component.html',
    styleUrls: ['./team.component.css']
})
export class TeamModal implements OnInit{

    @ViewChild('teamModal', {static: true}) public teamModal: ModalDirective;
    constructor() {

    }
    ngOnInit() {
    }

    show() {
        this.teamModal.show();
    }
    hide() {
        this.teamModal.hide();
    }      
}