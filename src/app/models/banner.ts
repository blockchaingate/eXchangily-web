export interface Banner {
    _id?: string;

    title: [{ lan: string, text: string }]; // lan, sc, tc, en, fr ... see language model
    titleLan: string; // title in current language, set locally.
    subtitle: [{ lan: string, text: string }]; // lan, sc, tc, en, fr ... see language model
    subtitleLan: string; // subtitle in current language, set locally
    desc: [{ lan: string, text: string }]; // lan, sc, tc, en, fr ... see language model
    descLan: string;
    imageUrl: string;
    imageAlt: string;
    clickLink: string;
    appId: string;
    merchantId: string;
    sequence: number;
    timeBegin: Date;
    timeEnd: Date;

    active: boolean,
    dateCreated: Date;
}