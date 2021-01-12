import { Component, ViewChild, EventEmitter, Output, OnInit } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { UtilService } from '../../../../services/util.service';

@Component({
    selector: 'tools-modal',
    templateUrl: './tools.modal.html',
    styleUrls: ['./tools.modal.css']
})
export class ToolsModal implements OnInit{
    _fabAddress: string;
    _exgAddress: string;
    to: string;
    satoshisPerBytes: number;
    @ViewChild('toolsModal', {static: true}) public toolsModal: ModalDirective;
    @Output() confirmedTools = new EventEmitter<any>();
    constructor(private utilServ: UtilService) {

    }
    ngOnInit() {
        this.satoshisPerBytes = environment.chains.BTC.satoshisPerBytes;
    }

    set fabAddress(address: string) {
        this._fabAddress = address;
        this._exgAddress = this.utilServ.fabToExgAddress(address);
    }
    
    get fabAddress(): string { return this._fabAddress; }

    set exgAddress(address: string) {
        this._exgAddress = address;
        this._fabAddress = this.utilServ.exgToFabAddress(address);
    }
    
    get exgAddress(): string { return this._exgAddress; }

    show() {
        this.toolsModal.show();
    }
    hide() {
        this.toolsModal.hide();
    }   
    
    BTCinFAB() {
        
        const toolData = {
            action: 'BTCinFAB',
            data: this.to,
            satoshisPerBytes: this.satoshisPerBytes
        };
        this.confirmedTools.emit(toolData);
    }

    FABinBTC() {
        const toolData = {
            action: 'FABinBTC',
            data: this.to,
            satoshisPerBytes: this.satoshisPerBytes
        };
        this.confirmedTools.emit(toolData);
    }
}