import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { TransactionItem } from '../models/transaction-item';
import {Transaction} from '../interfaces/kanban.interface';
import { Wallet } from '../models/wallet';

@Injectable()
export class StorageService {
    constructor(private localSt: LocalStorage) {

    }

    async getCurrentWallet() {
        let currentWalletIndex = await this.getCurrentWalletIndex();

        const wallets = await this.getWallets();
        // console.log('currentWalletIndex=' + currentWalletIndex);
        // console.log('walletsssss=', wallets);
        if (wallets) {
            if ((!currentWalletIndex) || (currentWalletIndex < 0)) {
                currentWalletIndex = 0;
            }
            if (currentWalletIndex > wallets.length - 1) {
                currentWalletIndex = wallets.length - 1;
            }              
            // console.log('currentWalletIndex here=' + currentWalletIndex);
            return wallets[currentWalletIndex];
        }
        return null;
    }
    
    async getWallets() {
        const wallets = await this.localSt.getItem('wallets').toPromise() as Wallet[];
        return wallets;
    }   

    async getCurrentWalletIndex() {
        const currentWalletIndex = await this.localSt.getItem('currentWalletIndex').toPromise() as number;
        // console.log('currentWalletIndex in get', currentWalletIndex);
        return currentWalletIndex;
    }
    addTradeTransaction(tx: Transaction) {
        this.localSt.getItem('mytransactions').subscribe((transactions: Transaction[]) => {
            if (!transactions) {
                transactions = [];
            }
            transactions.push(tx);
            // console.log('transactions before setItem');
            // console.log(transactions);
            return this.localSt.setItem('mytransactions', transactions).subscribe(() => {
            });
        });
    }

    storeFavoritePairs(favoritePairs: string[] ) {
        return this.localSt.setItem('favoritePairs', favoritePairs).subscribe(() => {});
    }

    getFavoritePairs() {
        return this.localSt.getItem('favoritePairs');
    }   

    storeToken(token: string) {
        return this.localSt.setItem('token', token).subscribe(() => {});
    }

    getToken() {
        return this.localSt.getItem('token');
    }
    
    removeToken(){
        return this.localSt.removeItem('token').subscribe(() => {});
    }

    storeCampaignQualify() {
        return this.localSt.setItem('campaignQualify', true).subscribe(() => {});
    }

    getCampaignQualify() {
        return this.localSt.getItem('campaignQualify');
    }
    
    removeCampaignQualify(){
        return this.localSt.removeItem('campaignQualify').subscribe(() => {});
    }



    storeToTransactionHistoryList(transactionItem: TransactionItem) {
        this.getTransactionHistoryList().subscribe((transactionHistory: TransactionItem[]) => {
            if (!transactionHistory) {
                transactionHistory = [];
            }
            transactionHistory.push(transactionItem);
            // console.log('transactionHistory for storeToTransactionHistoryList=', transactionHistory);
            return this.localSt.setItem('transactions', transactionHistory).subscribe(() => {});
        });
    }  

    updateTransactionHistoryList(transactionItem: TransactionItem) {
        this.getTransactionHistoryList().subscribe((transactionHistory: TransactionItem[]) => {
            if (!transactionHistory) {
                transactionHistory = [];
            }
            for (let i = 0; i < transactionHistory.length; i++) {
                if (transactionHistory[i].txid === transactionItem.txid) {
                    transactionHistory[i].status = transactionItem.status;
                    break;
                }
            }
            // console.log('transactionHistory for storeToTransactionHistoryList=', transactionHistory);
            return this.localSt.setItem('transactions', transactionHistory).subscribe(() => {});
        });
    }     
    getTransactionHistoryList() {
        return this.localSt.getItem('transactions');
    }    

    getCurrentLang(){
        return this.localSt.getItem('Lan');
    }


}
