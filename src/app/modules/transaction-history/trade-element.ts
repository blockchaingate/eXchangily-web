export interface TradeElement {
    orderHashOne: string;
    orderHashTwo: string;
    pair: string;
    oneGet: number;
    oneGiveFee: number,
    awardBackToTwo: number,
    twoGet: number;
    twoGiveFee: number;
    awardBackToOne: number;
    filledStatus: number;
    timestamp: number;
    txid: string;
}
