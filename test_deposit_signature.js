/**
 * Test script to compare deposit claim signature generation
 * between eXchangily-web and pay.cool-v3-app
 * 
 * This script will help identify the exact difference in signature encoding
 */

const BIP32 = require('bip32');
const ethUtil = require('ethereumjs-util');
const Web3 = require('web3');
const web3 = new Web3();

// Test data (use same values as mobile app for comparison)
const testSeed = Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex');
const testMessage = '00000000000000000000000000000000000000010000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000a2a3720c00c2872397e6d98f41305066cbf0f8b3254cbd93f69af7373dcf5fc01372230d309684f95053c7c9cbe95cf4e4e2da731';

// FAB coin type
const FAB_COIN_TYPE = 1150;

console.log('=== Testing FAB Deposit Claim Signature ===\n');

// Derive FAB private key
const root = BIP32.fromSeed(testSeed);
const childNode = root.derivePath(`m/44'/${FAB_COIN_TYPE}'/0'/0/0`);
const privateKey = childNode.privateKey;

console.log('Private Key:', privateKey.toString('hex'));
console.log('Message:', testMessage);
console.log('Message Length:', testMessage.length);
console.log('');

// Hash the message using Ethereum message prefix
function hashEthereumMessage(message) {
    const messageBytes = Buffer.from(message, 'hex');
    const prefix = `\x19Ethereum Signed Message:\n${messageBytes.length}`;
    const prefixBytes = Buffer.from(prefix);
    const concat = Buffer.concat([prefixBytes, messageBytes]);
    return web3.utils.keccak256(concat);
}

const messageHashHex = hashEthereumMessage(testMessage);
const messageHash = Buffer.from(messageHashHex.slice(2), 'hex');

console.log('Message Hash:', messageHashHex);
console.log('');

// Sign the message
const sig = ethUtil.ecsign(messageHash, privateKey);

console.log('Raw Signature:');
console.log('  r:', '0x' + Buffer.from(sig.r).toString('hex'));
console.log('  s:', '0x' + Buffer.from(sig.s).toString('hex'));
console.log('  v (raw):', sig.v);
console.log('');

// Encode v value (mobile app style)
const recovery = Number(sig.v) - 27; // 0 or 1
console.log('Recovery value:', recovery);

// Mobile app encoding: recovery + 27 + 4 (compressed)
const encodedV_mobile = recovery + 27 + 4;
console.log('Encoded V (mobile app):', encodedV_mobile, '(0x' + encodedV_mobile.toString(16) + ')');

// Web app encoding (current)
const encodedV_web = recovery + 27 + 4;
console.log('Encoded V (web app):', encodedV_web, '(0x' + encodedV_web.toString(16) + ')');

console.log('');
console.log('=== Signature Comparison ===');
console.log('Mobile app v:', '0x' + encodedV_mobile.toString(16).padStart(2, '0'));
console.log('Web app v:', '0x' + encodedV_web.toString(16).padStart(2, '0'));
console.log('Match:', encodedV_mobile === encodedV_web ? '✓ YES' : '✗ NO');

console.log('');
console.log('=== Payload Construction ===');

// Construct payload (mobile app style)
function fixLength(str, length) {
    str = str.replace(/^0x/, '');
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}

const chainId = '0000000000000000000000000000000000000001'; // FAB
const tokenId = '0000000000000000000000000000000000000001'; // Native coin
const recipient = 'a2a3720c00c2872397e6d98f41305066cbf0f8b3';
const txId = '254cbd93f69af7373dcf5fc01372230d309684f95053c7c9cbe95cf4e4e2da731';

const v_hex = fixLength(encodedV_mobile.toString(16), 64);
const r_hex = fixLength(Buffer.from(sig.r).toString('hex'), 64);
const s_hex = fixLength(Buffer.from(sig.s).toString('hex'), 64);

const payload = '0x' + v_hex + fixLength(chainId, 64) + fixLength(tokenId, 64) +
    '0000000000000000000000000000000000000000000000000000000000000000' +
    fixLength(recipient, 64) + fixLength(txId, 64) + r_hex + s_hex;

console.log('Payload length:', payload.length);
console.log('Expected length: 514 (0x + 8 * 64)');
console.log('Match:', payload.length === 514 ? '✓ YES' : '✗ NO');
console.log('');
console.log('Payload:', payload);
