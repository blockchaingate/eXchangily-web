import { Injectable } from '@angular/core';

import * as BIP39 from 'node_modules/bip39';

import { Wallet } from '../models/wallet';

import { ConfigService } from './config.service';
import { LocalStorage } from '@ngx-pwa/local-storage';

import {CoinService} from './coin.service';
import {UtilService} from './util.service';
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

        console.log('seed=');
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

    updateWalletPassword(wallet: Wallet, oldPassword: string, newPassword: string) {
        const pwdHashStr = this.utilService.SHA256(newPassword).toString();
        const  mnemonic = this.utilService.aesDecrypt(wallet.encryptedMnemonic, oldPassword);
        const seed = BIP39.mnemonicToSeedSync(mnemonic);
        const encryptedMnemonic = this.utilService.aesEncrypt(mnemonic, newPassword);   
        const encryptedSeed = this.utilService.aesEncryptSeed(seed, newPassword);
        wallet.pwdHash = pwdHashStr;
        wallet.encryptedMnemonic = encryptedMnemonic;
        wallet.encryptedSeed = encryptedSeed;
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
        let currentWalletIndex = await this.getCurrentWalletIndex();

        const wallets = await this.getWallets();
        console.log('currentWalletIndex=' + currentWalletIndex);
        console.log('walletsssss=', wallets);
        if (wallets) {
            if ((!currentWalletIndex) || (currentWalletIndex < 0)) {
                currentWalletIndex = 0;
            }
            if (currentWalletIndex > wallets.length - 1) {
                currentWalletIndex = wallets.length - 1;
            }              
            console.log('currentWalletIndex here=' + currentWalletIndex);
            return wallets[currentWalletIndex];
        }
        return null;
    }

    async getCurrentWalletIndex() {
        let currentWalletIndex = await this.localSt.getItem('currentWalletIndex').toPromise() as number;
        console.log('currentWalletIndex in get', currentWalletIndex);
        return currentWalletIndex;
    }

    async getWallets() {
        const wallets = await this.localSt.getItem('wallets').toPromise() as Wallet[];
        return wallets;
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

    updateWallets(wallets) {
        this.localSt.setItem('wallets', wallets).subscribe(() => {
        });
    }

    getWalletList() {
        return this.localSt.getItem('wallets');
    }

    /*
    getCurrentWalletIndex() {
        return this.localSt.getItem('currentWalletIndex');
    }
    */
    saveCurrentWalletIndex(value: number) {
        console.log('value for saveCurrentWalletIndex=' + value);
        /*
        this.localSt.removeItem('currentWalletIndex').subscribe(() => {
            this.localSt.setItem('currentWalletIndex', value).subscribe((newValue) => {console.log('newValue=' + newValue);});
        });
        */
        this.localSt.setItem('currentWalletIndex', value).subscribe( async (newValue) => {
            const index = await this.getCurrentWalletIndex();
            console.log('index=' + index);
        });
        
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
