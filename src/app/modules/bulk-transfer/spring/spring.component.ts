import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { environment } from '../../../../environments/environment';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-spring',
  templateUrl: './spring.component.html',
  styleUrls: ['./spring.component.scss']
})
export class SpringComponent implements OnInit {
    preview: boolean;
    accounts: any;
    balances: string;
    bidFAB: any;
    trades: any;
    bidEXG: any;
    depositUSDT: any;
    constructor(private httpServ: HttpService) {
    }
    ngOnInit() {
        this.bidFAB = [];
        this.bidEXG = [];   
        this.depositUSDT = [];   
        this.preview = false;
        this.springFestival();
    }

    addToArray(name: string, address: string, quantity: number) {
      let existed = false;
      if(name == 'FAB') {

        for(let i=0;i<this.bidFAB.length;i++) {
          const item = this.bidFAB[i];
          if(item.address == address) {
            item.quantity += quantity;
            existed = true;
          }
        }

        if(!existed) {
          this.bidFAB.push({address: address, quantity: quantity});
        }
      } else 
      if(name == 'EXG') {
        for(let i=0;i<this.bidEXG.length;i++) {
          const item = this.bidEXG[i];
          if(item.address == address) {
            item.quantity += quantity;
            existed = true;
          }
        }

        if(!existed) {
          this.bidEXG.push({address: address, quantity: quantity});
        }       
      } else 
      if(name == 'USDT') {
        for(let i=0;i<this.depositUSDT.length;i++) {
          const item = this.depositUSDT[i];
          if(item.address == address) {
            item.quantity += quantity;
            existed = true;
          }
        }

        if(!existed) {
          this.depositUSDT.push({address: address, quantity: quantity});
        }       
      }  
    }

    calculateFABReward() {
      for(let i = 0; i< this.bidFAB.length;i++) {
        const item = this.bidFAB[i];
        if(i === 0) {
          if(item.quantity >= 30000) {
            item.reward = 850;
          } else 
          if(item.quantity >= 20000) {
            item.reward = 550;
          } else
          if(item.quantity >= 10000) {
            item.reward = 350;
          } else
          if(item.quantity >= 5000) {
            item.reward = 150;
          } else
          if(item.quantity >= 2000) {
            item.reward = 80;
          }
        } else 
        if(i === 1) {
          if(item.quantity >= 20000) {
            item.reward = 550;
          } else
          if(item.quantity >= 10000) {
            item.reward = 350;
          } else
          if(item.quantity >= 5000) {
            item.reward = 150;
          } else
          if(item.quantity >= 2000) {
            item.reward = 80;
          }          
        } else
        if(i === 2) {
          if(item.quantity >= 10000) {
            item.reward = 350;
          } else
          if(item.quantity >= 5000) {
            item.reward = 150;
          } else
          if(item.quantity >= 2000) {
            item.reward = 80;
          }           
        } else
        if(i >= 3 && i <= 9) {
          if(item.quantity >= 5000) {
            item.reward = 150;
          } else
          if(item.quantity >= 2000) {
            item.reward = 80;
          }           
        } else
        if(i >= 10 && i <= 99) {
          if(item.quantity >= 2000) {
            item.reward = 80;
          }           
        }

      }
    }

    calculateEXGReward() {
      for(let i = 0; i< this.bidEXG.length;i++) {
        const item = this.bidEXG[i];
        if(i === 0) {
          if(item.quantity >= 80000) {
            item.reward = 850;
          } else 
          if(item.quantity >= 50000) {
            item.reward = 550;
          } else
          if(item.quantity >= 30000) {
            item.reward = 350;
          } else
          if(item.quantity >= 10000) {
            item.reward = 150;
          } else
          if(item.quantity >= 5000) {
            item.reward = 80;
          }
        } else 
        if(i === 1) {
          if(item.quantity >= 50000) {
            item.reward = 550;
          } else
          if(item.quantity >= 30000) {
            item.reward = 350;
          } else
          if(item.quantity >= 10000) {
            item.reward = 150;
          } else
          if(item.quantity >= 5000) {
            item.reward = 80;
          }         
        } else
        if(i === 2) {
          if(item.quantity >= 30000) {
            item.reward = 350;
          } else
          if(item.quantity >= 10000) {
            item.reward = 150;
          } else
          if(item.quantity >= 5000) {
            item.reward = 80;
          }           
        } else
        if(i >= 3 && i <= 9) {
          if(item.quantity >= 10000) {
            item.reward = 150;
          } else
          if(item.quantity >= 5000) {
            item.reward = 80;
          }            
        } else
        if(i >= 10 && i <= 99) {
          if(item.quantity >= 5000) {
            item.reward = 80;
          }           
        }

      }
    }

    previewDo() {
      this.accounts = {};
      for(let i=0;i<this.depositUSDT.length;i++) {
        const item = this.depositUSDT[i];
        const address = item.address;
        const reward = item.reward;
        if(!reward) {
          continue;
        }
        const mapItem = this.accounts[address];
        if(mapItem) {
          mapItem['EXG'] += reward;
        } else {
          this.accounts[address] = {};
          this.accounts[address]['EXG'] = reward;
        }
      }

      
      for(let i=0;i<this.bidFAB.length;i++) {
        const item = this.bidFAB[i];
        const address = item.address;
        const reward = item.reward;
        if(!reward) {
          continue;
        }
        const mapItem = this.accounts[address];
        if(mapItem) {
          mapItem['EXG'] += reward;
        } else {
          this.accounts[address] = {};
          this.accounts[address]['EXG'] = reward;
        }
      }

      for(let i=0;i<this.bidEXG.length;i++) {
        const item = this.bidEXG[i];
        const address = item.address;
        const reward = item.reward;
        if(!reward) {
          continue;
        }
        const mapItem = this.accounts[address];
        if(mapItem) {
          mapItem['EXG'] += reward;
        } else {
          this.accounts[address] = {};
          this.accounts[address]['EXG'] = reward;
        }
      }
      

      console.log('this.accounts=', this.accounts);
      this.preview = true;
    }


    getTradesTotal(address: string) {
      const trades = this.trades.filter(item => item.address1 == address || item.address2 == address);
      let total = 0;
      for(let i=0;i<trades.length;i++) {
        const item = trades[i];
        console.log('item in getTradesTotal===', item);
        total += Number(item.price) * Number(item.amount); 
      }
      return total;
    }

    calculateUSDTReward() {
      for(let i = 0; i< this.depositUSDT.length;i++) {
        const item = this.depositUSDT[i]; 
        const address = item.address;
        const quantity = item.quantity;

        if(quantity >= 200) {
          item.reward = 50;

          const tradesTotalUSDT = this.getTradesTotal(address);
          if(tradesTotalUSDT >= 50) {
            item.reward += 50;
          }         
        } 

      }    
    }
    async springFestival() {
        const fromTimestamp = 1612846800;
        const toTimeStamp = 1613624400;
        const promises = [];
        const url1 = environment.endpoints.kanban + 'tradesbetweentimestamps/' + fromTimestamp + '/' + toTimeStamp;
        promises.push(this.httpServ.getRaw(url1));

        const url2 = environment.endpoints.kanban + 'getdepositsbetween/' + fromTimestamp + '/' + toTimeStamp;
        promises.push(this.httpServ.getRaw(url2));
        
        const url3 = environment.endpoints.kanban + 'getwithdrawsbetween/' + fromTimestamp + '/' + toTimeStamp;
        promises.push(this.httpServ.getRaw(url3));


        forkJoin([this.httpServ.getRaw(url1), this.httpServ.getRaw(url2), this.httpServ.getRaw(url3)])
        .subscribe((results: any) => {
            // results[0] is our character
            // results[1] is our character homeworld
            console.log('results=', results);
            const trades = results[0];
            this.trades = trades;
            const deposits = results[1].data;
            const withdraws = results[2].data;
            console.log('trades=', trades);
            console.log('deposits==', deposits);
            console.log('withdraws==', withdraws);


            for(let i=0;i<trades.length;i++) {
              const trade = trades[i];
              const pairName = trade.pairName;
              const address1 = trade.address1;
              const address2 = trade.address2;
              const bidOrAsk = trade.bidOrAsk;
              const amount  = trade.amount;
              const price = trade.price;
              if(['FABUSDT','EXGUSDT'].indexOf(pairName) < 0) {
                continue;
              }

              if(pairName == 'FABUSDT') {
                if(bidOrAsk) {
                  this.addToArray('FAB', address1, Number(amount));
                  this.addToArray('FAB', address2, -Number(amount));
                } else {
                  this.addToArray('FAB', address1, -Number(amount));
                  this.addToArray('FAB', address2, Number(amount));
                }
              } else {
                console.log('trade for EXG');
                if(bidOrAsk) {
                  this.addToArray('EXG', address1, Number(amount));
                  this.addToArray('EXG', address2, -Number(amount));
                } else {
                  this.addToArray('EXG', address1, -Number(amount));
                  this.addToArray('EXG', address2, Number(amount));                  
                }
              }
            }

            for(let i=0;i<deposits.length; i++) {
              const item = deposits[i];
              const coin = item.coin;
              if(coin.indexOf('USDT') < 0) {
                continue;
              }
              const address = item.address;
              const quantity = item.quantity;
              this.addToArray('USDT', address, Number(quantity));
            }

            for(let i=0;i<withdraws.length; i++) {
              const item = withdraws[i];
              const coin = item.coin;
              if(coin.indexOf('USDT') < 0) {
                continue;
              }
              const address = item.address;
              const quantity = item.quantity;
              this.addToArray('USDT', address, -Number(quantity));
            }

            this.bidFAB.sort(function(a, b) {
              return b.quantity - a.quantity;
            });  
            
            this.bidEXG.sort(function(a, b) {
              return b.quantity - a.quantity;
            });  
 
            this.depositUSDT.sort(function(a, b) {
              return b.quantity - a.quantity;
            });              

            this.bidFAB = this.bidFAB.filter(item => item.quantity > 0);
            this.bidEXG = this.bidEXG.filter(item => item.quantity > 0);
            this.depositUSDT = this.depositUSDT.filter(item => item.quantity > 0);
            //this.bidFAB = this.bidFAB.slice(0, 10);
            //this.bidEXG = this.bidEXG.slice(0, 10);
            console.log('this.bidFab=', this.bidFAB);
            console.log('this.bidEXG=', this.bidEXG);  
            this.calculateFABReward();          
            this.calculateEXGReward();
            this.calculateUSDTReward();
          });
    }    
}