import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpService } from '../services/http.service';

const path = environment.endpoints.blockchaingate;

@Injectable()
export class TicketService {
  constructor(private http: HttpService) { }

  getTicketCats() {
    return this.http.get(path + 'ticket-cat');
  }

  // Create ticket
  createTicket(ticket: any, token: string) {
    return this.http.postPrivate(path + 'ticket/create', ticket, token);
  }

  // Get ticket by id
  getTicket(id: string) {
    return this.http.get(path + 'ticket/' + id);
  }

  // find by memberId, appId, active = true | false, lanCode
  findTicket(data: any, token: string) {
    return this.http.postPrivate(path + 'ticket/find', data, token);
  }

  // Update ticket
  updateTicket(ticket: any, token: string) {
    return this.http.postPrivate(path + 'ticket/update', ticket, token);
  }
}
