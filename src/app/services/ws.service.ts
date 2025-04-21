import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { WebSocketSubject } from 'rxjs/webSocket';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { ApiService } from './api.service';
import { TimerService } from './timer.service';
import { StorageService } from './storage.service';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class WsService {

  // dapp's websocket
  isSocketActive: boolean = false;
  txHashes: any = [];
  socket: any;

  exgAddress = '';

  socketAllPrices: any;
  private allPricesSource = new BehaviorSubject([]);
  currentPrices = this.allPricesSource.asObservable();


  constructor(
    private apiService: ApiService,
    private storageService: StorageService,


  ) { this.getAllPrices(); }
  getAllPrices() {
    this.socketAllPrices = new WebSocketSubject(environment.websockets.allprices);
    this.socketAllPrices.subscribe(
      (arr: any) => {
        this.allPricesSource.next(arr);
      }
    );
  }

  public connectSocketDapp() {
    let currentUrl = window.location.href;
    const urlParams = new URLSearchParams(currentUrl);
    const value = urlParams.get("deviceId");

    if (value != null) {
      this.isSocketActive = true;

      // this.socket = new WebSocketSubject("ws://localhost:3000/ws/paycool@69FC8EC9-7F77-46EB-9445-522229F98771");
      this.socket = new WebSocketSubject(environment.websockets.dapp + value);

      this.socket.subscribe(async (data: any) => {

        try {
          if (data["source"] != null) {
            let str = data["source"];
            let parts = str.split("-");
            let secondPart = parts[1];
            if (secondPart == "connect") {

              let addr = data["data"][0]["address"];

              this.exgAddress = addr;


            } else if (secondPart == "result") {
              let str = data["data"]; // "paycool-connect"

              const baseUrl = environment.production
                ? "https://www.exchangily.com"
                : "https://test.exchangily.com";

              this.txHashes.push(baseUrl + "/explorer/tx-detail/" + str);

              console.log(this.txHashes);
            }
          }
          return new Observable((observer: Observer<any>) => {
            this.socket.on("message", (data: any) => observer.next(data));
          });
        } catch (error) {
          return new Observable((observer: Observer<any>) => {
            this.socket.on("message", (data: any) => observer.next(data));
          });
        }
      });
    }
  }

  public sendMessage(param: any): void {
    this.socket.next(param);
  }


  getExchangeAddress(): string {

    if (this.exgAddress == null) {

      this.socket.next({ "source": "Hookpay-get", "data": "paycool-connect" });

    }

    return this.exgAddress;
  }

}
