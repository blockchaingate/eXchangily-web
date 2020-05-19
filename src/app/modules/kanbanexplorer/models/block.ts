export interface Block {
    
    _writeBack: string;
    difficulty: string;
    extraData: string;
    gasLimit: number;
    gasUsed: number;
    hash: string;
    hashNoSignature: string;
    logsBloom: string;
    miner: string;
    mixHash: string;
    nextBlock: string;
    nonce: string;
    number: number;
    parentHash: string;
    receiptsRoot: string;
    round: number;
    sha3Uncles: string;
    signature: string;
    size: number;
    stateRoot: string;
    timestamp: number;
    totalDifficulty: string;
    transactions: string[] ;
    transactionsRoot: string ;
    uncles: string[]

}

export interface BlockMetainfo {
    number:Number;
    timestamp:Number;
    hash:string;
    size:number;
    totalTransactions:Number;
    totalOrders:Number;
    totalDepositRequests:Number;
    totalWithdrawRequests:Number;
    totalTrades:Number;
}