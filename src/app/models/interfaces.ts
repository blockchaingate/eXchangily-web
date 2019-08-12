import * as crypto from 'crypto-js';

export interface SHA256 extends crypto.WordArray {
    sigBytes: 32;
    words: [number, number, number, number, number, number, number, number];
}

export interface Coinbase {
    coinbase: string;
    sequence: string;
}

export interface ScriptPubKey {
    addresses?: string[];
    asm: string;
    hex: string;
    reqSigs?: number;
    type: string;
}

export interface Transaction {
    txid: string;
    hash: string;
    vin: (Coinbase | Utxo) [];
    vout: { value: number, n: number, scriptPubKey: ScriptPubKey } [];
    time: number;
    confirmations: number;
}

interface Utxo {
    // This is NOT UTXO class or model.
    // This interface only used for the result of calling raw transaction api
    txid: string;
    vout: number;
    scriptSig: {
        asm: string,
        hex: string
    };
}

export interface ABI extends Array<AbiFunction | AbiConstructor | AbiEvent> {
}


export interface AbiFunction {
    anonymous?: boolean;
    constant: boolean;
    inputs: {
        indexed?: boolean,
        name: string,
        type: string
    }[];
    name: string;
    outputs: {
        name: string,
        type: string
    }[];
    payable?: boolean;
    stateMutability?: string;
    type: 'function';
}

export interface AbiEvent {
    name: string;
    type: 'event';
    anonymous?: boolean;
    inputs: {
        indexed?: boolean,
        name: string,
        type: string
    }[];
    outputs?: {
        name: string,
        type: string
    }[];
}

export interface AbiConstructor {
    constant?: true;
    inputs: {
        indexed?: boolean,
        name: string,
        type: string
    }[];
    outputs?: {
        name: string,
        type: string
    }[];
    payable: boolean;
    stateMutability: string;
    type: 'constructor';
    name?: undefined;
}


export enum GlobalVars {
    KEY_NETWORK = 'NETWORK',
    KEY_ENCRYPTED_SEED = 'SEED',
    KEY_PASSWORD_HASH = 'PASSWORD_HASH',
    KEY_LOCAL_STORAGE = 'LOCAL_STORAGE',
    KEY_LANGUAGE = 'LANGUAGE',
    KEY_CONTACTS = 'contacts',
    KEY_HISTORIES_FABCOIN = 'history_fabcoin',
    KEY_SMART_CONTRACTS = 'smart_contracts',
    KEY_TOKEN = 'tokens',
    KEY_TEST_ITEM = 'test_item'
}

export enum GlobalSettings {
    KEY_NETWORK = GlobalVars.KEY_NETWORK,
    KEY_ENCRYPTED_SEED = GlobalVars.KEY_ENCRYPTED_SEED,
    KEY_PASSWORD_HASH = GlobalVars.KEY_PASSWORD_HASH,
    KEY_LOCAL_STORAGE = GlobalVars.KEY_LOCAL_STORAGE,
    KEY_LANGUAGE = GlobalVars.KEY_LANGUAGE
}