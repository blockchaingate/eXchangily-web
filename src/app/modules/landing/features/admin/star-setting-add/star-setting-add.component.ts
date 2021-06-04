import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { StarService } from '../../../service/star/star.service';
import { StorageService } from '../../../../../services/storage.service';

@Component({
    selector: 'app-star-setting-add',
    templateUrl: './star-setting-add.component.html',
    styleUrls: ['./star-setting-add.component.scss']
  })
  export class StarSettingAddComponent implements OnInit {

    id: string;
    receivingContractAdd: string;
    consumer: number;
    merchant: number;
    merchantReferral: number;
    consumerLevel1: number;
    consumerLevel2: number;
    consumerLevel3: number;
    consumerLevel4: number;
    consumerLevel5: number;
    consumerLevel6: number;
    consumerLevel7: number;
    consumerLevel8: number;

    coin1: string;
    coin1Proportion: number;

    coin2: string;
    coin2Proportion: number;    

    token: string;
    constructor(
      private starServ: StarService,
      private router: Router,
      private _storageServ: StorageService,
      private route: ActivatedRoute) {}

    ngOnInit() {
      this._storageServ.getToken().subscribe(
        (token: string) => {
          this.token = token;

          this.route.params.subscribe((params: Params) => {
            this.id = params['id'];
            console.log('this.id=', this.id);
            if(this.id) {
              this.starServ.getSetting(this.id, this.token).subscribe(
                (setting:any) => {
                  this.receivingContractAdd = setting.receivingContractAdd;
                  this.consumer = setting.consumer;
                  this.merchant = setting.merchant;
                  this.merchantReferral = setting.merchantReferral;
                  this.consumerLevel1 = setting.consumerLevel1;
                  this.consumerLevel2 = setting.consumerLevel2;
                  this.consumerLevel3 = setting.consumerLevel3;
                  this.consumerLevel4 = setting.consumerLevel4;
                  this.consumerLevel5 = setting.consumerLevel5;
                  this.consumerLevel6 = setting.consumerLevel6;
                  this.consumerLevel7 = setting.consumerLevel7;
                  this.consumerLevel8 = setting.consumerLevel8;
                  const rewards = setting.rewards;
                  if(rewards && rewards.length > 0) {
                    this.coin1 = rewards[0].coin;
                    this.coin1Proportion = rewards[0].proportion;
                    if(rewards.length > 1) {
                      this.coin2 = rewards[1].coin;
                      this.coin2Proportion = rewards[1].proportion;                  
                    }
                  }
                  //this.consumerLevel1 = setting.consumerLevel1;
                }
              );
            }
          });
        });
    }

    confirm() {
      console.log('receivingContractAdd==', this.receivingContractAdd);
      const data = {
        receivingContractAdd: this.receivingContractAdd,
        consumer: this.consumer,
        merchant: this.merchant,
        merchantReferral: this.merchantReferral,
        consumerLevel1: this.consumerLevel1,
        consumerLevel2: this.consumerLevel2,
        consumerLevel3: this.consumerLevel3,
        consumerLevel4: this.consumerLevel4,
        consumerLevel5: this.consumerLevel5,
        consumerLevel6: this.consumerLevel6,
        consumerLevel7: this.consumerLevel7,
        consumerLevel8: this.consumerLevel8,
        rewards: [
          {
            coin: this.coin1,
            proportion: this.coin1Proportion
          },
          {
            coin: this.coin2,
            proportion: this.coin2Proportion
          }         
        ]
      }

      console.log('data==', data);
      this.starServ.upsertSetting(data, this.token).subscribe(
        (ret: any) => {
          this.router.navigate(['/admin/star-settings']);
        }
      );
    }
  }

  /*
      receivingContractAdd: String, // smart contract address
    merchant: Number,
    merchantReferral: Number,
    consumer: Number,
    consumerLevel1: Number,
    consumerLevel2: Number,
    consumerLevel3: Number,
    consumerLevel4: Number,
    consumerLevel5: Number,
    consumerLevel6: Number,
    consumerLevel7: Number,
    consumerLevel8: Number,
    rewards: [
        {
            coin: String,
            proportion: Number
        }
    ],
  */