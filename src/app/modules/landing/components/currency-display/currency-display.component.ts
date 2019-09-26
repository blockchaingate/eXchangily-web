import { Component, OnInit, Input, AfterContentChecked } from '@angular/core';

import { Currency, Symbols } from '../../models/currency';

@Component({
  selector: 'currency-display',
  templateUrl: './currency-display.component.html',
  styleUrls: ['./currency-display.component.scss']
})
export class CurrencyDisplayComponent implements AfterContentChecked {
  @Input() curType: Currency;
  @Input() amount: string;

  symbol = '';

  constructor() { }

  ngAfterContentChecked() {
    this.symbol = Symbols[this.curType];
  }
}
