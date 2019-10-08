export interface Application {
    _id?: string;
    name?: string;
    fullName?: string;
    domain?: string;

    coins?: {symbol: String, add: String}[];

    appAdmin?: string; // Admin email.
    appAdminId?: string;
    mediaAdminId?: string;
    memberAdminId?: string;
    financeAdminId?: string;

    emailer?: {email: string, pwd: string, server: string, port: string};

    desc?: string;
    address?: string;
    city?: string;
    prov?: string;
    country?: string;
    phoneCountryCode?: string;
    phoneAreaCode?: string;
    phoneNumber?: string;
    phoneExt?: string;
    email?: string;
    docs?: [{name: String, type: String, url: String}];
    rank?: Number;
    credit?: Number;
    lastUpdated?: Date;
    dateCreated?: Date;
}
