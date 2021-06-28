import { Component, OnInit, TemplateRef } from '@angular/core';
import { StorageService } from '../../../../../services/storage.service';
import { StarService } from '../../../service/star/star.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-star-orders',
    templateUrl: './star-orders.component.html',
    styleUrls: ['./star-orders.component.scss']
  })
  export class StarOrdersComponent implements OnInit {
      token: string;
      orders: any;
      modalRef: BsModalRef;
      payments: any;
      
      constructor(
        private modalServ: BsModalService,
        private starServ: StarService,
        private _storageServ: StorageService
      ) { }  
          
      ngOnInit() {
        this._storageServ.getToken().subscribe(
            (token: string) => {
              this.token = token;
              this.starServ.getAllOrders(token).subscribe(
                (res: any) => {
                    this.orders = res;
                },
                (error: any) => {
                  this.orders = [];
                }
              );
            }
          );          
      }

      getStatusText(status: number) {
        if(status == 0) {
          return 'waiting for payment';
        } else
        if(status == 1) {
          return 'payment made';
        } else 
        if(status == 3) {
          return 'payment confirmed';
        } else
        if(status == 4) {
          return 'completed - coins sent';
        } else
        if(status == 5) {
          return 'cancelled';
        } else
        if(status == 6) {
          return 'suspended';
        }
        return 'undefined';
      }

      getPaymentStatusText(status: number) {
        if(status == 0) {
          return 'failed';
        } else
        if(status == 1) {
          return 'success';
        } else
        if(status == 2) {
          return 'refunded';
        }
        return 'undefined';
      }

      changeStatus(order: any, status: number) {
        this.starServ.changeOrderStatus(order._id, status, this.token).subscribe(
          (res: any) => {
            if(res && res._id) {
              order.status = status;
            }
          }
        );
      }

      openModal(order: any, template: TemplateRef<any>) {
        this.starServ.getPayments(order._id).subscribe(
          (res) => {
            if(Array.isArray(res)) {
              this.payments = res;
            }
            
            this.modalRef = this.modalServ.show(template, { class: 'modal-lg', backdrop: 'static' });
          },
          (error) => {
            this.modalRef = this.modalServ.show(template, { class: 'modal-lg', backdrop: 'static' });
          }
        );
        
      }      
  }
