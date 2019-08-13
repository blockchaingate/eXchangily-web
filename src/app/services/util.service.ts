import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { MyCoin } from '../models/mycoin';

@Injectable()
export class UtilService {
    // The aesEncrypt method is use for encrypt the message, encrypted is bytes, you can use encrypted.toString() convert to string.
    aesEncrypt(messageToEnc: string, pwd: string) {
        const encrypted = CryptoJS.AES.encrypt(messageToEnc, pwd);
        return encrypted;
        // return encrypted.toString();
    }

    aesDecrypt(encryted: any, pwd: string) {
        return CryptoJS.AES.decrypt(encryted, pwd).toString(CryptoJS.enc.Utf8);
    }   
    
    aesEncryptSeed(seed: Buffer, pwd: string) {
        const seedString = seed.toString('base64');
        return this.aesEncrypt(seedString, pwd);
    }

    aesDecryptSeed(encryted: any, pwd: string) {
        const decrytedString = this.aesDecrypt(encryted, pwd);
        return Buffer.from(decrytedString, 'base64');
    }

    getDecimal(coin: MyCoin) {
        if (coin.decimals) {
            return coin.decimals;
        }
        if (coin.name === 'ETH') {
            return 18;
        }
        return 8;
    }
    SHA256(data: string) {
        return CryptoJS.SHA256(data);
    }

    fixedLengh( obj: any, length: number) {
        let str = obj.toString();
        const strLength = str.length;
        if (strLength >= length) {
            str = str.substring(strLength - length);
            console.log(str);
            return str;
        }
        for (let i = 0; i < length - strLength; i++) {
            str = '0' + str;
        }   
        return str;     
    }    
}