export class History {
    static schema: {
        type: 'object', properties: {
            'date': { type: 'string' },
            'amount': { type: 'number' },
            'from': { type: 'array', items: { type: 'string' } },
            'remarks': { type: 'string' },
            'sendOut': { type: 'boolean' },
            'txid': { type: 'string' },
            'vout:': { type: 'number' },
            'unit': { type: 'string' }
        }
    };

    date: number;
    amount: number;
    from: string[];
    to: string;
    // name: string;
    remarks?: string;
    sendOut: boolean;
    txid: string;
    vout: number;
    unit: string;

    constructor(from: string[], to: string, amount: number, unit: string, date: number, sendOut: boolean,
        txid: string, vout?: number, remarks?: string, name?: string) {
        if (from) {
            this.from = from;
        }
        this.to = to;
        this.unit = unit;
        // this.name = name;
        this.sendOut = sendOut;
        this.amount = amount;
        this.date = date;
        this.remarks = remarks;
        this.txid = txid;
        this.vout = vout;
    }
}
