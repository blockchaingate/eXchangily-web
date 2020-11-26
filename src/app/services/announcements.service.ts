
import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';
import { Announcement } from '../models/announcement';

@Injectable()
export class AnnouncementsService {
    constructor(private http: HttpService) { }

    getAnnouncementsCats(lan: string) {
        return this.http.get('announcements/categories/' + lan);
    }

    getManyByLan(lan: string) {
        return this.http.get('announcements/language/' + lan);
    }

    // Create an announcement
    create(announcement: Announcement, token: string) {
        return this.http.postPrivate('announcements/create', announcement, token);
    }

    // Get announcement by id
    getById(id: string) {
        return this.http.get('announcements/' + id);
    }

    // find by memberId, appId, active = true | false, lanCode
    find(critia: any) {
        return this.http.post('announcements/find', critia, true);
    }

    // Update an announcements 
    update(announcement: Announcement) {
        return this.http.post('announcements/update', announcement, true);
    }

    delete(id: string) {
        return this.http.get('announcements/delete/' + id, true);
    }
}
