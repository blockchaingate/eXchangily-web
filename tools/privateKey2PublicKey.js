const privateKey = '0x';
const util = require('ethereumjs-util')
const publicKey = util.privateToPublic(privateKey).toString('hex');
console.log('publicKey=', publicKey);
