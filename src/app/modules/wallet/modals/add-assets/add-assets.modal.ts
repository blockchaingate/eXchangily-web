import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';
import {Token} from '../../../../interfaces/kanban.interface';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'add-assets-modal',
    templateUrl: './add-assets.modal.html',
    styleUrls: ['./add-assets.modal.css']
})
export class AddAssetsModal {
    @ViewChild('addAssetsModal', {static: true}) public addAssetsModal: ModalDirective;
    @Output() confirmedAssets = new EventEmitter<[Token]>();
    selectedIndex: number;
    fabCoinsSelected = [];
    ethCoinsSelected = [];
    otherCoinsSelected = [];
    showFabCustom = false;
    showEthCustom = false;

    /*
    otherCoins = [
        {
            name: 'BTC in FAB address'
        },
        {
            name: 'FAB in BTC address'
        }
    ];
    */
    ethTokens = [
       
        {
            name: 'USD Coin', 
            contractAddress: environment.addresses.smartContract.USDC,
            symbol: 'USDC',
            decimals: 6
        }      
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
        fabPrivateKey: [''],
        fabContractAddress: [''],
        ethContractAddress: [''],
    });    

    constructor(private fb: FormBuilder) {
        this.selectedIndex = 0;
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

    /*
    onOthersSelection(e, v) {
        this.otherCoinsSelected = [];
        for (let i = 0; i < v.length; i++) {
            this.otherCoinsSelected.push(v[i].value);
        }        
    }
    */
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
        if(this.selectedIndex == 0) {
            const token = {
                type: '',
                name: 'FAB',
                privateKey: this.addAssetsForm.get('fabPrivateKey').value
            }
            tokens.push(token);

            this.confirmedAssets.emit(tokens as [Token]);
            this.hide();            
            return;
        }
        
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
