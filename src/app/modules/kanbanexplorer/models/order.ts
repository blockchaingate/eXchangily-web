export interface Order {
    orderHash: String;
    pairName: String;
    bidOrAsk: boolean;
    price: string;
    orderQuantity: string;
    originalOrderQuantity: string;
    currentOrderQuantity: string;
    filledQuantity: string;
    time: number;
    matchedOrders: MatchedOrders[],
    isActive: boolean
    txHash: TxHash
    blockNumber: BlockNumber;
}

interface MatchedOrders {
    orderHash: string;
    quantity: string;
    price: string;
}

interface TxHash {
    createOrder: String;
    cancelOrder: String;
}

interface BlockNumber {
    createOrder: Number;
    fulfilOrder: Number[];
    cancelOrder: Number;
}