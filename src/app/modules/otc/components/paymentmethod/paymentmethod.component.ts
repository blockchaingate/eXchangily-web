import { Component, OnInit, Input } from '@angular/core';
import { faAlipay } from '@fortawesome/free-brands-svg-icons';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-paymentmethod',
  templateUrl: './paymentmethod.component.html',
  styleUrls: ['./paymentmethod.component.css']
})
export class PaymentmethodComponent implements OnInit {
  @Input() methods: string[];
  constructor() { }
  faAlipay = faAlipay;
  faCreditCard = faCreditCard;

  ngOnInit() {
  }

}
