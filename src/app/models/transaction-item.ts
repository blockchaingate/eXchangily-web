export class TransactionItem {
// item for transaction history
    walletId: string;
    type: string;
    tokenType: string;
    coin: string;
    chain?: string;
    amount: number;
    txid: string;
    action: string;
    to: string;
    quantity: number;
    timestamp: number;
    time: Date;
    comment: string;
    confirmations: string;
    blockhash: string;
    status: string;
}
