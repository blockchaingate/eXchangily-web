export interface Subscribe {
    _id?: string;
    email?: string;
    title?: string;
    name?: string;
    merchantId?: string;
    msgType?: string; // multiple, seperated by comma',', none for any.
    lanCode?: string; // none for english;
    period?: string;  // none for all
    active?: boolean;
    veriCode?: string; // to send with every message to user's email box for cancel purpose.
    lastUpdated?: Date;
    dateCreated?: Date;
}
