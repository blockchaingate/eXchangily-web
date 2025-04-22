export interface WithdrawRequest {
    coinName: String;
    value: string;
    withdrawToAddress: String;
    address: String;
    timestamp: number;
    txHash: String;
    blockNumber: Number;
}