import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { MyCoin } from '../models/mycoin';
// import * as createHash from 'create-hash';
import BigNumber from 'bignumber.js/bignumber';
import * as Btc from 'bitcoinjs-lib';
import * as bs58 from 'bs58';
@Injectable()
export class UtilService {
    auth_code = 'encrypted by crypto-js|';
    // The aesEncrypt method is use for encrypt the message, encrypted is bytes, you can use encrypted.toString() convert to string.
    aesEncrypt(messageToEnc: string, pwd: string) {
        const encrypted = CryptoJS.AES.encrypt(this.auth_code + messageToEnc, pwd).toString();
        return encrypted;
        // return encrypted.toString();
    }

    aesDecrypt(encryted: any, pwd: string) {
        try {
            const encryptedRawData = CryptoJS.AES.decrypt(encryted, pwd).toString(CryptoJS.enc.Utf8);
            if (!encryptedRawData.startsWith(this.auth_code)) {
                //return '';
                return encryptedRawData;
            }
            return encryptedRawData.slice(this.auth_code.length);
        } catch (e) { }
        return '';
    }

    aesEncryptSeed(seed: Buffer, pwd: string) {
        const seedString = seed.toString('base64');
        return this.aesEncrypt(seedString, pwd);
    }

    aesDecryptSeed(encryted: any, pwd: string) {
        const decrytedString = this.aesDecrypt(encryted, pwd);
        if (decrytedString) {
            return Buffer.from(decrytedString, 'base64');
        }
        return null;
    }

    hexCharToDec(hexChar: string) {
        return parseInt(hexChar, 16);
    }

    hexToDec(hex: string) {
        if (hex.length === 1) {
            return this.hexCharToDec(hex);
        }
        const leftHex = hex.slice(0, hex.length - 1);
        const rightHex = hex.slice(-1);
        // console.log('leftHex=' + leftHex);
        // console.log('rightHex=' + rightHex);
        return this.hexToDec(leftHex) * 16 + this.hexCharToDec(rightHex);
    }
    showTime(time: string) {
        const timeArray = time.split('.');
        return timeArray[0].replace('T', ' ');
    }
    copy(str: string) {
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = str;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }

    arraysEqual(a1, a2) {
        /* WARNING: arrays must not contain {objects} or behavior may be undefined */
        return JSON.stringify(a1) === JSON.stringify(a2);
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

    toPrecision(num: number) {
        return Math.round(num * 10000) / 10000;
    }

    getFormattedDate(date: Date) {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const min = date.getMinutes();
        const sec = date.getSeconds();

        const monthStr = (month < 10 ? '0' : '') + month;
        const dayStr = (day < 10 ? '0' : '') + day;
        const hourStr = (hour < 10 ? '0' : '') + hour;
        const minStr = (min < 10 ? '0' : '') + min;
        const secStr = (sec < 10 ? '0' : '') + sec;

        const str = date.getFullYear() + '-' + monthStr + '-' + dayStr + ' ' + hourStr + ':' + minStr + ':' + secStr;

        return str;
    }

    SHA256(data: string) {
        return CryptoJS.SHA256(data);
    }

    fixedLengh(obj: any, length: number) {
        let str = obj.toString();
        const strLength = str.length;
        if (strLength >= length) {
            str = str.substring(strLength - length);
            // console.log(str);
            return str;
        }
        for (let i = 0; i < length - strLength; i++) {
            str = '0' + str;
        }
        return str;
    }

    stripHexPrefix(str) {
        if (str && (str.length > 2) && (str[0] === '0') && (str[1] === 'x')) {
            return str.slice(2);
        }
        return str;
    }

    showAddAmount(amount1, amount2, decimal: number) {
        const amount1BigNumber = new BigNumber(amount1);
        const amount2BigNumber = new BigNumber(amount2);
        const total = amount1BigNumber.plus(amount2BigNumber);
        return this.showAmount(total.toFixed(decimal), decimal);
        /*
        const amount1Show = this.showAmount(amount1);
        const amount2Show = this.showAmount(amount2);

        const totalAmount = amount1Show + amount2Show ;
        if (amount1Show === 0.00003 || amount1Show === 0.00007) {
            console.log('amount1Show=', amount1Show );
            console.log('amount2Show=', amount2Show );
            console.log('total=', totalAmount );
        }
        return totalAmount;
        */
    }

    showAmountArr(amountArr, decimal: number) {
        let amount = new BigNumber(0);

        for (let i = 0; i < amountArr.length; i++) {
            if (amountArr.length > 1) {
            }
            amount = amount.plus(this.showAmount(amountArr[i], decimal));
        }
        return amount.toFixed(decimal);
    }

    showAmount(amount, decimal: number) {

        if (!amount || amount.toString() === '0') {
            return '0';
        }

        const bigN = new BigNumber(amount).dividedBy(new BigNumber(1e18));
        /*
        let numStr = amount.toString();
 
        if (numStr.indexOf('e') >= 0) {
            return new BigNumber(numStr).dividedBy(1e18).toNumber();
        }
        const numStrLength = numStr.length;
        if (numStrLength < 18) {
            for (let i = 0; i < 18 - numStrLength; i++) {
 
               numStr = '0' + numStr;
            }
        }
 
 
        const str1 = numStr.substr(0, numStr.length - 18);
        const str2 = numStr.substr(numStr.length - 18);
        numStr = str1 + '.' + str2;
 
        numStr = numStr.substring(0, 10);
        const retNumber = Math.floor(Number(numStr) * 100000000) / 100000000;
        // const retNum = Number(retNumber);
        return retNumber;
        */
        const fixN = bigN.toFixed(decimal).substr(0, 10);
        return fixN;

    }

    convertLiuToFabcoin(amount) {

        return Number(Number(amount * 1e-8).toFixed(8));
    }



    number2Buffer(num) {
        const buffer = [];
        const neg = (num < 0);
        num = Math.abs(num);
        while (num) {
            buffer[buffer.length] = num & 0xff;
            num = num >> 8;
        }

        var top = buffer[buffer.length - 1];
        if (top & 0x80) {
            buffer[buffer.length] = neg ? 0x80 : 0x00;
        }
        else if (neg) {
            buffer[buffer.length - 1] = top | 0x80;
        }
        return Buffer.from(buffer);
    }

    hex2Buffer(hexString) {
        var buffer = [];
        for (var i = 0; i < hexString.length; i += 2) {
            buffer[buffer.length] = (parseInt(hexString[i], 16) << 4) | parseInt(hexString[i + 1], 16);
        }
        return Buffer.from(buffer);
    }

    fabToExgAddress(address: string) {
        const bytes = bs58.decode(address);
        const addressInWallet = bytes.toString('hex');
        return '0x' + addressInWallet.substring(2, 42);
    }
    
    toKanbanAddress(publicKey: Buffer) {

        // publicKey = this.stripHexPrefix(publicKey);
        /*
         const hash1 = createHash('sha256').update(Buffer.from(publicKey, 'hex')).digest().toString('hex');
         const hash2 = createHash('ripemd160').update(Buffer.from(hash1, 'hex')).digest().toString('hex');
  
         return '0x' + hash2;
         */
        const hash01 = Btc.crypto.sha256(publicKey);
        const hash02 = Btc.crypto.ripemd160(hash01).toString('hex');
        const address = '0x' + hash02;
        return address;
    }

}
