import { Component, ViewChild, EventEmitter, Output, OnInit } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'tools-modal',
    templateUrl: './tools.modal.html',
    styleUrls: ['./tools.modal.css']
})
export class ToolsModal implements OnInit{
    to: string;
    satoshisPerBytes: number;
    @ViewChild('toolsModal', {static: true}) public toolsModal: ModalDirective;
    @Output() confirmedTools = new EventEmitter<any>();
    
    ngOnInit() {
        this.satoshisPerBytes = environment.chains.BTC.satoshisPerBytes;
    }

    show() {
        this.toolsModal.show();
    }
    hide() {
        this.toolsModal.hide();
    }   
    
    BTCinFAB() {
        console.log('to=', this.to);
        const toolData = {
            action: 'BTCinFAB',
            data: this.to,
            satoshisPerBytes: this.satoshisPerBytes
        };
        this.confirmedTools.emit(toolData);

    }
}