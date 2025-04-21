import { Component, ViewChild, EventEmitter, Output, OnInit } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { UtilService } from '../../../../services/util.service';
import * as exaddr from '../../../../lib/exaddr';

@Component({
    selector: 'tools-modal',
    templateUrl: './tools.modal.html',
    styleUrls: ['./tools.modal.css']
})
export class ToolsModal implements OnInit{
    _fabAddress = '';
    _exgAddress = '';
    _kbAddress = '';
    to = '';
    satoshisPerBytes = 0;
    @ViewChild('toolsModal', {static: true}) public toolsModal: ModalDirective = {} as ModalDirective;
    @Output() confirmedTools = new EventEmitter<any>();
    constructor(private utilServ: UtilService) {
    }

    ngOnInit() {
        this.satoshisPerBytes = environment.chains.BTC.satoshisPerBytes;
    }

    set fabAddress(address: string) {
        this._fabAddress = address;
        this._exgAddress = this.utilServ.fabToExgAddress(address);
        this._kbAddress = exaddr.toKbpayAddress(this._fabAddress);
    }
    
    get fabAddress(): string { return this._fabAddress; }

    set exgAddress(address: string) {
        this._exgAddress = address;
        this._fabAddress = this.utilServ.exgToFabAddress(address);
        this._kbAddress = exaddr.toKbpayAddress(this._fabAddress);
    }
    
    get exgAddress(): string { return this._exgAddress; }

    set kbAddress(address: string) {
        this._kbAddress = address;
        this._fabAddress = exaddr.toLegacyAddress(address);
        this._exgAddress = this.utilServ.fabToExgAddress(this._fabAddress);
    }
    
    get kbAddress(): string { return this._kbAddress; }

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