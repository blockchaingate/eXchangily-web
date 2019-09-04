import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { concatMap, flatMap, map, mergeMap, take } from 'rxjs/operators';
import { BehaviorSubject, forkJoin, from, Observable, Observer, of, scheduled, Scheduler, SchedulerLike } from 'rxjs';
// import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';


import * as BIP32 from 'node_modules/bip32';
import * as BIP39 from 'node_modules/bip39';
import * as fabcoinjs from 'node_modules/fabcoinjs-lib/src';

import { Wallet } from '../models/wallet';

import { ConfigService } from './config.service';
import { LocalStorage } from '@ngx-pwa/local-storage';

import {CoinService} from './coin.service';
import {UtilService} from './util.service';
import * as Btc from 'bitcoinjs-lib';
enum addressType {
    receive = 'receive',
    change = 'change'
}

@Injectable()
export class WalletService {
    wallet: Wallet; // set when loged in, else it is null.

    constructor(private configServ: ConfigService, private localSt: LocalStorage, private coinService: CoinService,
        private utilService: UtilService) {
    }

    validateMnemonic(mnemonic: string) {
        return BIP39.validateMnemonic(mnemonic);
    }
    generateMnemonic() {
        return BIP39.generateMnemonic();
    }

    // Format wallet from input data.
    formatWallet(pwd: string, name: string, mnemonic: string) {
        const seed = BIP39.mnemonicToSeedSync(mnemonic);
        console.log('seed generated');
        console.log(seed);
        const seedHash = this.utilService.SHA256(seed.toString());
        const seedHashStr = seedHash.toString();
        const pwdHashStr = this.utilService.SHA256(pwd).toString();

        const encryptedSeed = this.utilService.aesEncryptSeed(seed, pwd);
        const encryptedMnemonic = this.utilService.aesEncrypt(mnemonic, pwd);
        const wallet = new Wallet(seedHashStr.substr(0, 8), name, pwdHashStr, encryptedSeed.toString(), encryptedMnemonic.toString());
        const myCoins = this.coinService.initMyCoins(seed);

        wallet.addCoins(myCoins);
        const exCoin = this.coinService.initExCoin(seed);
        wallet.addExCoin(exCoin);
        return wallet;
    }

    // Generate walllet, store it to db and set current wallet to it.
    generateWallet(pwd: string, name: string, mnemonic: string): Wallet {
        const pwdValid = this.pwdStrength(pwd);
        if (pwdValid === 'strong' || pwdValid === 'medium') {
            this.wallet = this.formatWallet(pwd, name, mnemonic);
            console.log('this.wallet in generateWallet');
            console.log(this.wallet);
            return this.wallet;
        } else {
            return null;
        }
    }

    // Search wallet from wallets stored in localStorage.
    searchWallet(name: string, pwd: string) {
        this.localSt.getItem('wallets').subscribe((wallets: Wallet[]) => {
            wallets.forEach((wallet: Wallet) => {
                if (wallet.name.toLowerCase() === name.toLowerCase()) {
                    const pwdHashStr = this.utilService.SHA256(pwd).toString();
                    if (wallet.pwdHash === pwdHashStr) {
                        this.wallet = wallet;
                        return wallet;
                    }
                }
            });
        });
    }
    getCurrentWallets() {
        return this.localSt.getItem('wallets');
    }

    async getCurrentWallet() {
        const currentWalletIndex = await this.localSt.getItem('currentWalletIndex').toPromise() as number;
        const wallets = await this.localSt.getItem('wallets').toPromise() as Wallet[];
        if (currentWalletIndex >= 0 && wallets) {
            return wallets[currentWalletIndex];
        }
        return null;
    }

    storeToWalletList(wallet: Wallet) {
        this.localSt.getItem('wallets').subscribe((wallets: Wallet[]) => {
            if (!wallets) {
                wallets = [];
            }
            const index = wallets.indexOf(wallet);
            if (wallets.indexOf(wallet) < 0) {
                wallets.push(wallet);
                
            }
            return this.localSt.setItem('wallets', wallets);
        });
    }

    updateToWalletList(wallet: Wallet, index: number) {

        this.localSt.getItem('wallets').subscribe((wallets: Wallet[]) => {
            if (!wallets) {
                wallets = [];
            }
            if (wallets && wallets.length > 0) {
                wallets[index] = wallet;
            }

            this.localSt.setItem('wallets', wallets).subscribe(() => {
            });
        });
    }

    async deleteCurrentWallet() {
        const currentWalletIndex = await this.localSt.getItem('currentWalletIndex').toPromise() as number;
        const wallets = await this.localSt.getItem('wallets').toPromise() as Wallet[];
        console.log('currentWalletIndex=', currentWalletIndex);
        console.log('wallets1', wallets);
        if (currentWalletIndex >= 0 && wallets) {
            wallets.slice(currentWalletIndex);
        }
        console.log('wallets2', wallets);
        if (wallets.length > 0) {
            this.saveCurrentWalletIndex(0);
        }
        this.localSt.setItem('wallets', wallets).subscribe(() => {
        });
    }

    getWalletList() {
        return this.localSt.getItem('wallets');
    }

    getCurrentWalletIndex() {
        return this.localSt.getItem('currentWalletIndex');
    }

    saveCurrentWalletIndex(value: number) {
        this.localSt.setItem('currentWalletIndex', value).subscribe(() => {});
    }
    
    restoreWallet(mnemonic: string, pwd: string) {
        const theWallet = this.formatWallet(pwd, name, mnemonic);
    }

    pwdStrength(pwd: string): string {
        const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');
        const mediumRegex = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})');
        if (strongRegex.test(pwd)) {
            return 'strong';
        } else if (mediumRegex.test(pwd)) {
            return 'medium';
        } else if (pwd.length > 4) {
            return 'week';
        } else {
            return 'invalid';
        }
    }

    logIn(pwd: string) {
        this.wallet = null;
        const pwdHash = this.utilService.SHA256(pwd).toString();
        this.localSt.getItem('wallets').subscribe((wallets: Wallet[]) => {
            wallets.forEach(wallet => {
                if (wallet.pwdHash === pwdHash) {
                    this.wallet = wallet;
                    return this.wallet;
                }
            });
        });
    }

    getWalletStatus(): boolean {
        return sessionStorage.loggedIn;
    }
}
