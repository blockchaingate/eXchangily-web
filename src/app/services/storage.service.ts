import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { TransactionItem } from '../models/transaction-item';
import { Transaction } from '../models/kanban.interface';
import { IssueToken } from '../models/fab.interface';
import { Wallet } from '../models/wallet';

@Injectable()
export class StorageService {
    constructor(private localSt: StorageMap) {
    }

    setItem(name: string, value: any) {
        return this.localSt.set(name, value);
    }

    getItem(name: string) {
        return this.localSt.get(name);
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
        const wallets = await this.localSt.get('wallets').toPromise() as Wallet[];
        return wallets;
    }

    async getCurrentWalletIndex() {
        const currentWalletIndex = await this.localSt.get('currentWalletIndex').toPromise() as number;
        // console.log('currentWalletIndex in get', currentWalletIndex);
        return currentWalletIndex;
    }

    addTradeTransaction(tx: Transaction) {
        this.localSt.get('mytransactions').subscribe((transactions: any) => {
            if (!transactions) {
                transactions = [];
            }
            transactions.push(tx);
            // console.log('transactions before setItem');
            // console.log(transactions);
            return this.localSt.set('mytransactions', transactions).subscribe(() => {
            });
        });
    }

    getIssueTokenTransactions() {
        return this.localSt.get('issue-tokens');
    }

    addIssueTokenTransaction(tx: IssueToken) {
        this.localSt.get('issue-tokens').subscribe((transactions: any) => {
            if (!transactions) {
                transactions = [];
            }
            transactions.push(tx);
            // console.log('transactions before setItem');
            // console.log(transactions);
            return this.localSt.set('issue-tokens', transactions).subscribe(() => {
            });
        });
    }

    storeIssueTokenTransactions(txs: IssueToken[]) {
        return this.localSt.set('issue-tokens', txs).subscribe(() => {
        });
    }

    storeFavoritePairs(favoritePairs: string[]) {
        return this.localSt.set('favoritePairs', favoritePairs).subscribe(() => { });
    }

    getFavoritePairs() {
        return this.localSt.get('favoritePairs');
    }

    storeToken(token: string) {
        return this.localSt.set('token', token).subscribe(() => { });
    }

    getToken() {
        return this.localSt.get('token');
    }

    removeToken() {
        return this.localSt.delete('token').subscribe(() => { });
    }

    storeCampaignQualify() {
        return this.localSt.set('campaignQualify', true).subscribe(() => { });
    }

    getCampaignQualify() {
        return this.localSt.get('campaignQualify');
    }

    setIsMobile(isMobile: boolean) {
        return this.localSt.set('isMobile', isMobile).subscribe(() => { });
    }
    
    getIsMobile() {
        return this.localSt.get('isMobile');
    }

    removeCampaignQualify() {
        return this.localSt.delete('campaignQualify').subscribe(() => { });
    }

    storeToTransactionHistoryList(transactionItem: TransactionItem) {
        this.getTransactionHistoryList().subscribe((transactionHistory: any) => {
            if (!transactionHistory) {
                transactionHistory = [];
            }
            transactionHistory.push(transactionItem);
            // console.log('transactionHistory for storeToTransactionHistoryList=', transactionHistory);
            return this.localSt.set('transactions', transactionHistory).subscribe(() => {});
        });
    }

    updateTransactionHistoryList(transactionItem: TransactionItem) {
        this.getTransactionHistoryList().subscribe((transactionHistory: any) => {
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
            return this.localSt.set('transactions', transactionHistory).subscribe(() => {});
        });
    }

    getTransactionHistoryList() {
        return this.localSt.get('transactions');
    }

    getCurrentLang() {
        return this.localSt.get('Lan');
    }
}
