export interface Announcement {
    _id?: string;

    title?: string;
    subtitle?: string;
    appId?: string;
    category?: string;
    createdBy?: string; // MemberId
    language?: string;
    content?: string;
    contentSummary?: string;
    headline?: boolean;
    keywords?: [string];
    thumbNail?: string;

    lastUpdated?: Date;
    dateCreated?: Date;
}
