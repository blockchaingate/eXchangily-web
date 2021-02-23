import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { MyCoin } from '../models/mycoin';
import * as createHash from 'create-hash';
import BigNumber from 'bignumber.js/bignumber';
import * as Btc from 'bitcoinjs-lib';
import * as bs58 from 'bs58';
import { environment } from 'src/environments/environment';
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
                // return '';
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
        //console.log('num=', num);

        if(!num) {
            return 0;
        }
                
        let decimal = 5;
        if(num < 0.001) {
            decimal = 7;
        }

        const numString = num.toString();
        if(numString.indexOf('e') >= 0) {
            return num;
        }

        const numArr = numString.split('.');
        if(numArr.length == 1) {
            return num;
        }

        //console.log('numArr==', numArr);
        return Number(numArr[0] + '.' + numArr[1].substring(0, decimal));
        /*
        if(num >= 0.1) {
            return Number(num.toFixed(5));
        }
        return Math.round(num * 10000) / 10000;
        */

    }

    getFormattedDate(date: any) {
        // console.log('origin date=', date);
        // if(Number.is)
        if (!Number.isNaN(date)) {
            date = new Date(date * 1000);
        }
        // console.log('date=', date);
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

    toBigNumber(amount, decimal: number) {
        console.log('amount=', amount);
        console.log('decimal=', decimal);
        if (amount === 0 || amount === '0') {
            return '0';
        }

        if(amount.toString().indexOf('e-') > 0) {
            const amountArr = amount.toString().split('e');
            /*
            if(decimal >= amountArr[1]) {
                const 
                let amountStrFull = amountArr[0];
                for(let i=0;i<decimal-amountArr[1];i++) {
                    amountStrFull += '0';
                }
                return amountStrFull;
            } else {
                return (amountArr[0] + 'e-' + (amountArr[1] - decimal));
            }
            */
           return new BigNumber(amountArr[0] + 'e' + (Number(amountArr[1]) + decimal)).toFixed();
        }
        const amountStr = amount.toString();
        const amountArr = amountStr.split('.');
        const amountPart1 = amountArr[0];
        const numPart1 = Number(amountPart1);
        let amountPart2 = '';
        if (amountArr[1]) {
            amountPart2 = amountArr[1].substring(0, decimal);
        }

        const amountPart2Length = amountPart2.length;
        if (decimal > amountPart2Length) {
            for (let i = 0; i < decimal - amountPart2Length; i++) {
                amountPart2 += '0';
            }
        }

        let amountStrFull = (numPart1 ? amountPart1 : '') + amountPart2;
        amountStrFull = amountStrFull.replace(/^0+/, '');
        console.log('amountStrFull=', amountStrFull);
        return amountStrFull;
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
        // const fixN = bigN.toFixed(decimal).substr(0, 10);

        const fixedString = bigN.toFixed(decimal);
        /*
        if(fixedString.indexOf(".") < 0) {
            return fixedString;
        }
        */
        const fixN = fixedString.slice(0, (fixedString.indexOf('.')) + decimal + 1);
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

        const top = buffer[buffer.length - 1];
        if (top & 0x80) {
            buffer[buffer.length] = neg ? 0x80 : 0x00;
        } else if (neg) {
            buffer[buffer.length - 1] = top | 0x80;
        }
        return Buffer.from(buffer);
    }

    toNumber(num) {
        const arr = num.split('.');
        if(arr.length <= 1) {
            return Number(arr);
        }
        return Number(arr[0] + '.' + arr[1].substring(0, 7));
    }
    
    hex2Buffer(hexString) {
        const buffer = [];
        for (let i = 0; i < hexString.length; i += 2) {
            buffer[buffer.length] = (parseInt(hexString[i], 16) << 4) | parseInt(hexString[i + 1], 16);
        }
        return Buffer.from(buffer);
    }

    fabToExgAddress(address: string) {
        const bytes = bs58.decode(address);
        const addressInWallet = bytes.toString('hex');
        console.log('addressInWallet==', addressInWallet);
        return '0x' + addressInWallet.substring(2, 42);
    }

    exgToFabAddress(address: string) {
        let prefix = '6f';
        if (environment.production) {
            prefix = '00';
        }
        address = prefix + this.stripHexPrefix(address);

        let buf = Buffer.from(address, 'hex');

        const hash1 = createHash('sha256').update(buf).digest().toString('hex');
        const hash2 = createHash('sha256').update(Buffer.from(hash1, 'hex')).digest().toString('hex');

        buf = Buffer.from(address + hash2.substring(0, 8), 'hex');
        address = bs58.encode(buf);

        return address;
    }

    toKanbanAddress(publicKey: Buffer) {

        // publicKey = this.stripHexPrefix(publicKey);
        /*
         const hash1 = createHash('sha256').update(Buffer.from(publicKey, 'hex')).digest().toString('hex');
         const hash2 = createHash('ripemd160').update(Buffer.from(hash1, 'hex')).digest().toString('hex');
  
         return '0x' + hash2;
         */
        console.log('publicKey: ' + publicKey);

        const hash01 = Btc.crypto.sha256(publicKey);
        const hash02 = Btc.crypto.ripemd160(hash01).toString('hex');
        const address = '0x' + hash02;
        return address;
    }

}
