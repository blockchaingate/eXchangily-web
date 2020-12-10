
import { Injectable } from '@angular/core';
import { HttpService } from '../../../services/http.service';

@Injectable()
export class ClubService {
    constructor(private http: HttpService) { }
}
