export interface Tokenlock {
    _id?: string;
    name?: string;
    symbol?: string;
    decimals?: number;
    ownerAddBase58?: string;
    ownerAddHex?: string;
    balance?: number;
    lockedBalance?: number;
    active?: boolean;
    dateCreated?: Date;
}
