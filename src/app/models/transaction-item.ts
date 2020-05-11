export class TransactionItem {
// item for transaction history
    walletId: string;
    type: string;
    coin: string;
    tokenType: string;
    amount: number;
    txid: string;
    to: string;
    time: Date;
    comment: string;
    confirmations: string;
    blockhash: string;
    status: string;
}
