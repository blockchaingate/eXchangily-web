
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpService } from '../services/http.service';

const path = environment.endpoints.blockchaingate;

@Injectable()
export class AnnouncementsService {
    constructor(private http: HttpService) { }

    getAnnouncementsCats(lan: String) {
        return this.http.get(path + 'announcements/' + lan);
    }

    getAnnouncementsList(lan: String) {
        return this.http.get(path + 'announcements/' + lan);
    }

    // Create announcements
    createAnnouncements(announcements, token) {
        return this.http.postPrivate(path + 'announcements/create', announcements, token);
    }

    // Get announcements by id
    getAnnouncements(id: string) {
        return this.http.get(path + 'announcements/' + id);
    }

    // find by memberId, appId, active = true | false, lanCode
    findAnnouncements(data, token) {
        return this.http.postPrivate(path + 'announcements/find', data, token);
    }

    // Update announcements
    updateAnnouncements(announcements, token) {
        return this.http.postPrivate(path + 'announcements/update', announcements, token);
    }
}
