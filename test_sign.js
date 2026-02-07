const { Common } = require('@ethereumjs/common');
const { TransactionFactory } = require('@ethereumjs/tx');
const { Buffer } = require('buffer');

const chainId = 211;
const networkId = 211;
const privateKeyHex = 'e331b6d69882b4cb4ea581d88e0b604039a3de5967d88cbce3ea96715f5d3782'; // Dummy key
const privateKey = Buffer.from(privateKeyHex, 'hex');

const customCommon = Common.custom(
    {
        name: 'kanban-mainnet',
        networkId: networkId,
        chainId: chainId
    },
    {
        hardfork: 'petersburg'
    }
);

const txData = {
    nonce: 0,
    gasPrice: 50000000,
    gasLimit: 20000000,
    to: '0x0000000000000000000000000000000000000000',
    value: 0,
    data: '0x'
};

const tx = TransactionFactory.fromTxData(txData, { common: customCommon });
const signedTx = tx.sign(privateKey);
const serialized = signedTx.serialize();
const hex = '0x' + serialized.toString('hex');

console.log('Chain ID:', chainId);
console.log('Signed Raw TX:', hex);
console.log('v:', signedTx.v.toNumber()); // Should be chainId * 2 + 35 or 36
console.log('Sender:', signedTx.getSenderAddress().toString());

// Recovery check
const recoveredTx = TransactionFactory.fromSerializedData(serialized);
console.log('Recovered Chain ID:', recoveredTx.common.chainId()); // Might be undefined if not provided in common, but let's see if it extracts it.
// Actually TransactionFactory.fromSerializedData tries to determine common if not provided, but mostly defaults to mainnet if not EIP155?
// Wait, if it IS EIP155, it extracts ChainID.

const v = signedTx.v.toNumber();
const derivedChainId = Math.floor((v - 35) / 2);
console.log('Derived Chain ID from v:', derivedChainId);

if (derivedChainId !== chainId) {
    console.error('MISMATCH! Derived chainId does not match configured chainId');
} else {
    console.log('MATCH: Chain ID verified correctly.');
}
