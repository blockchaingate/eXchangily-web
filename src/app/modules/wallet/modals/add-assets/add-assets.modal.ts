import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';
import {Token} from '../../../../interfaces/kanban.interface';

@Component({
    selector: 'add-assets-modal',
    templateUrl: './add-assets.modal.html',
    styleUrls: ['./add-assets.modal.css']
})
export class AddAssetsModal {
    @ViewChild('addAssetsModal', {static: true}) public addAssetsModal: ModalDirective;
    @Output() confirmedAssets = new EventEmitter<[Token]>();

    fabCoinsSelected = [];
    ethCoinsSelected = [];
    otherCoinsSelected = [];
    showFabCustom = false;
    showEthCustom = false;

    otherCoins = [
        {
            name: 'BTC in FAB address'
        },
        {
            name: 'FAB in BTC address'
        }
    ];

    ethTokens = [
        {
            name: 'EAB', 
            contractAddress: '0x8278FDC79A8041667e79bBB20331c7c8548DEd20',
            symbol: 'EAB',
            decimals: 18
        },        
        {
            name: 'TTT', 
            contractAddress: '0xc32ae45504ee9482db99cfa21066a59e877bc0e6',
            symbol: 'Tangany Test Token',
            decimals: 18
        },
        {
            name: 'CT', 
            contractAddress: '0x20fe562d797a42dcb3399062ae9546cd06f63280',
            symbol: 'ChainLink Token',
            decimals: 18
        },        
    ]; 

    fabTokens = [
        {
            name: 'KAB',
            contractAddress: '',
            symbol: 'KAB',
            decimals: 18
        }
    ]; 

    addAssetsForm = this.fb.group({
        fabContractAddress: [''],
        ethContractAddress: [''],
    });    

    constructor(private fb: FormBuilder) {

    }
    
    onFabSelection(e, v) {
        console.log(e.option.selected, v); 
        this.fabCoinsSelected = [];
        for (let i = 0; i < v.length; i++) {
            this.fabCoinsSelected.push(v[i].value);
        }
        if (this.fabCoinsSelected.indexOf('0') >= 0) {
            this.showFabCustom = true;
        } else {
            this.showFabCustom = false;
        }
        console.log('this.showFabCustom=' + this.showFabCustom);
    }

    onOthersSelection(e, v) {
        this.otherCoinsSelected = [];
        for (let i = 0; i < v.length; i++) {
            this.otherCoinsSelected.push(v[i].value);
        }        
    }

    onEthSelection(e, v) {
        console.log(e.option.selected, v); 
        this.ethCoinsSelected = [];
        for (let i = 0; i < v.length; i++) {
            this.ethCoinsSelected.push(v[i].value);
        }
        if (this.ethCoinsSelected.indexOf('0') >= 0) {
            this.showEthCustom = true;
        } else {
            this.showEthCustom = false;
        }     
        console.log('this.showEthCustom=' + this.showEthCustom);   
    }

/*
    type: string;     // ETH or FAB
    address: string;  // Contract Address
    name: string;
    symbol: string;
    decimals: number;
*/    

    onSubmit() {
        const tokens = [];
        for (let i = 0; i < this.fabCoinsSelected.length; i++) {
            const token = {
                type: 'FAB',
                address: this.fabTokens[this.fabCoinsSelected[i] - 1].contractAddress,
                name: this.fabTokens[this.fabCoinsSelected[i] - 1].name,
                symbol: this.ethTokens[this.fabCoinsSelected[i] - 1].symbol,
                decimals: this.fabTokens[this.fabCoinsSelected[i] - 1].decimals
            };
            tokens.push(token);
        }

        for (let i = 0; i < this.ethCoinsSelected.length; i++) {
            const token = {
                type: 'ETH',
                address: this.ethTokens[this.ethCoinsSelected[i] - 1].contractAddress,
                name: this.ethTokens[this.ethCoinsSelected[i] - 1].name,
                symbol: this.ethTokens[this.ethCoinsSelected[i] - 1].symbol,
                decimals: this.ethTokens[this.ethCoinsSelected[i] - 1].decimals
            };
            tokens.push(token);
        }

        this.confirmedAssets.emit(tokens as [Token]);
        this.hide();
    }

    show() {
        this.addAssetsModal.show();
    }
    hide() {
        this.addAssetsModal.hide();
    }
}
