import { Component, ViewChild, EventEmitter, Output, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';
import { Token } from '../../../../interfaces/kanban.interface';
import { environment } from '../../../../../environments/environment';
import { ApiService } from '../../../../services/api.service';
import { UtilService } from '../../../../services/util.service';
import { CoinService } from '../../../../services/coin.service';

@Component({
    selector: 'add-assets-modal',
    templateUrl: './add-assets.modal.html',
    styleUrls: ['./add-assets.modal.css']
})
export class AddAssetsModal implements OnInit {
    @ViewChild('addAssetsModal', { static: true }) public addAssetsModal: ModalDirective = {} as ModalDirective;
    @Output() confirmedAssets = new EventEmitter<[Token]>();
    selectedIndex: number;
    fabCoinsSelected: any = [];
    ethCoinsSelected: any = [];
    otherCoinsSelected: any = [];
    showFabCustom: any = false;
    showEthCustom: any = true;

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
    ethTokens: any = [

        {
            name: 'USD Coin',
            contractAddress: environment.addresses.smartContract.USDC,
            symbol: 'USDC',
            decimals: 6
        }
    ];

    fabTokens: any = [];

    addAssetsForm = this.fb.group({
        fabPrivateKey: [''],
        fabContractAddress: [''],
        fabTokenName: [''],
        fabTokenSymbol: [''],
        fabTokenDecimals: [18],
        ethChain: ['ETH'],
        ethContractAddress: [''],
        ethTokenName: [''],
        ethTokenSymbol: [''],
        ethTokenDecimals: [18]
    });

    constructor(
        private utilServ: UtilService,
        private coinServ: CoinService,
        private fb: FormBuilder, private apiServ: ApiService) {
        this.selectedIndex = 0;
    }

    ngOnInit() {
        this.apiServ.getIssueTokens().subscribe(
            (ret: any) => {
                this.fabTokens = ret;
            }
        );

        const ethContractAddressObj = this.addAssetsForm.get("ethContractAddress");
        if (ethContractAddressObj) {
            ethContractAddressObj.valueChanges.subscribe(x => {
                this.loadSmartContractInfo();
            });
        }


        const ethChainObj = this.addAssetsForm.get("ethChain");
        if (ethChainObj) {
            ethChainObj.valueChanges.subscribe(x => {
                this.loadSmartContractInfo();
            });
        }

    }

    async loadSmartContractInfo() {
        const chain: any = this.addAssetsForm.value.ethChain;
        let smartContractAddress = this.addAssetsForm.get('ethContractAddress')?.value;
        console.log('chain===', chain);
        console.log('smartContractAddress===', smartContractAddress);
        if (smartContractAddress) {
            if (chain == 'TRX') {
                const name = await this.coinServ.getTrxTokenName(smartContractAddress);
                this.addAssetsForm.get('ethTokenName')?.setValue(name);
                const decimals = await this.coinServ.getTrxTokenDecimals(smartContractAddress);
                this.addAssetsForm.get('ethTokenDecimals')?.setValue(decimals);
                const symbol = await this.coinServ.getTrxTokenSymbol(smartContractAddress);
                this.addAssetsForm.get('ethTokenSymbol')?.setValue(symbol);
            } else
                if (this.utilServ.stripHexPrefix(smartContractAddress).length == 40) {
                    const decimals = await this.apiServ.getEtheruemCompatibleDecimals(chain, smartContractAddress);
                    this.addAssetsForm.get('ethTokenDecimals')?.setValue(decimals);

                    const name = await this.apiServ.getEtheruemCompatibleName(chain, smartContractAddress);
                    this.addAssetsForm.get('ethTokenName')?.setValue(name);

                    const symbol = await this.apiServ.getEtheruemCompatibleSymbol(chain, smartContractAddress);
                    this.addAssetsForm.get('ethTokenSymbol')?.setValue(symbol);

                }
        }

    }

    onFabSelection(e: any, v: any) {
        //console.log('e===', e);
        //console.log(e.option.selected, v); 
        this.fabCoinsSelected = [];
        for (let i = 0; i < v.length; i++) {
            if (v && v[i] && v[i].value) {
                this.fabCoinsSelected.push(v[i].value);
            }

        }
        if (this.fabCoinsSelected.indexOf('0') >= 0) {
            this.showFabCustom = true;
        } else {
            this.showFabCustom = false;
        }
    }

    /*
    onOthersSelection(e, v) {
        this.otherCoinsSelected = [];
        for (let i = 0; i < v.length; i++) {
            this.otherCoinsSelected.push(v[i].value);
        }        
    }
    */
    onEthSelection(e: any, v: any) {
        //console.log(e.option.selected, v); 
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
        const tokens: any = [];
        if (this.selectedIndex == 0) { //FAB
            const token = {
                type: '',
                name: 'FAB',
                privateKey: this.addAssetsForm.value.fabPrivateKey
            }
            tokens.push(token);

            this.confirmedAssets.emit(tokens as [Token]);
            this.hide();

            this.addAssetsForm.patchValue({
                fabPrivateKey: ''
            });
            return;
        } else if (this.selectedIndex == 1) { //FAB token
            const smartContractAddress = this.addAssetsForm.get('fabContractAddress')?.value;
            const name = this.addAssetsForm.get('fabTokenName')?.value;
            const symbol = this.addAssetsForm.get('fabTokenSymbol')?.value;
            const decimals = this.addAssetsForm.get('fabTokenDecimals')?.value;

            if (smartContractAddress && name && symbol && decimals) {
                const token = {
                    type: 'FAB',
                    address: smartContractAddress,
                    name: name,
                    symbol: symbol,
                    decimals: decimals
                };
                tokens.push(token);

                this.addAssetsForm.patchValue({
                    fabContractAddress: '',
                    fabTokenName: '',
                    fabTokenSymbol: '',
                    fabTokenDecimals: 18
                });
            }
        } else if (this.selectedIndex == 2) { //ETH token
            const chain = this.addAssetsForm.get('ethChain')?.value;
            const smartContractAddress = this.addAssetsForm.get('ethContractAddress')?.value;

            const name = this.addAssetsForm.get('ethTokenName')?.value;
            const symbol = this.addAssetsForm.get('ethTokenSymbol')?.value;
            const decimals = this.addAssetsForm.get('ethTokenDecimals')?.value;
            if (smartContractAddress && name && symbol && decimals) {
                const token = {
                    type: chain,
                    address: smartContractAddress,
                    name: name,
                    symbol: symbol,
                    decimals: decimals
                };
                tokens.push(token);

                this.addAssetsForm.patchValue({
                    ethContractAddress: '',
                    ethTokenName: '',
                    ethTokenSymbol: '',
                    ethTokenDecimals: 18
                });
            }
        }

        if (this.fabCoinsSelected && this.fabCoinsSelected.length > 0) {
            for (let i = 0; i < this.fabCoinsSelected.length; i++) {
                const fabToken: any = this.fabTokens[this.fabCoinsSelected[i] - 1];
                console.log('fabToken===', fabToken);
                if (fabToken) {
                    const token = {
                        type: 'FAB',
                        address: fabToken.tokenId,
                        name: fabToken.name,
                        symbol: fabToken.symbol,
                        decimals: fabToken.decimals
                    };
                    console.log('tokens===', tokens);
                    tokens.push(token);
                }

            }
        }

        if (this.ethCoinsSelected && this.ethCoinsSelected.length > 0) {
            for (let i = 0; i < this.ethCoinsSelected.length; i++) {
                const ethToken = this.ethTokens[this.ethCoinsSelected[i] - 1];
                if (ethToken) {
                    const token = {
                        type: 'ETH',
                        address: ethToken.contractAddress,
                        name: ethToken.name,
                        symbol: ethToken.symbol,
                        decimals: ethToken.decimals
                    };
                    tokens.push(token);
                }

            }
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
