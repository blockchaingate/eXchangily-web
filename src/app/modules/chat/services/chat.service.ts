
import { Injectable } from '@angular/core';
import { HttpService } from '../../../services/http.service';

@Injectable()
export class ChatService {
    constructor(private http: HttpService) { }
}
