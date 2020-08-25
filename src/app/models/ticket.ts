export interface Ticket {
    _id?: string;
    parentId?: string;
    catId: number;
    title: string;
    content: string;
    email: string;
    photos?: [string];
    memberId?: string;
    lanCode: string;
    urgent: number; // 1-9, 1 is the most urgent.
    active?: boolean;
    appId: string;
    notes?: string;

    processRecords?: [{ content: String, staffMemberId: string, processTime: Date }];

    lastUpdated?: Date;
    dateCreated?: Date;
}
