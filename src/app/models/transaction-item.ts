export class TransactionItem {
// item for transaction history
    walletId: string;
    type: string;
    tokenType: string;
    coin: string;
    chain?: string;
    amount: number;
    action: string;
    from: string;
    to: string;
    quantity: number;
    timestamp: number;
    comment: string;
    confirmations: string;
    blockhash: string;
    status: string;
    transactionId: string;
}
