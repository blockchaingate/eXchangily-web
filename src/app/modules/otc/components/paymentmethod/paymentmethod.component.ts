import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-paymentmethod',
  templateUrl: './paymentmethod.component.html',
  styleUrls: ['./paymentmethod.component.css']
})
export class PaymentmethodComponent implements OnInit {
  @Input() methods: any[];
  constructor() { }

  ngOnInit() {
  }

}
