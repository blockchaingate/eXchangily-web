import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { QRCodeModule } from 'angularx-qrcode';

import { TranslateModule } from '@ngx-translate/core';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { LoadingComponent } from './loading/loading.component';
import { CurrencyDisplayComponent } from './currency-display/currency-display.component';
import { LightboxComponent } from './lightbox/lightbox.component';
import { UsdInfoComponent } from './usd-info/usd-info.component';
import { RmbInfoComponent } from './rmb-info/rmb-info.component';
import { CoinInfoComponent } from './coin-info/coin-info.component';
import { EthInfoComponent } from './eth-info/eth-info.component';
import { SocialBarComponent } from './social-bar/social-bar.component';
import { CountryPickerComponent } from './country-picker/country-picker.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    QRCodeModule
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    DropdownComponent,
    LoadingComponent,
    CurrencyDisplayComponent,
    LightboxComponent,
    UsdInfoComponent,
    RmbInfoComponent,
    EthInfoComponent,
    CoinInfoComponent,
    SocialBarComponent,
    CountryPickerComponent
  ],
  exports: [
    TranslateModule,
    HeaderComponent,
    FooterComponent,
    DropdownComponent,
    LoadingComponent,
    CurrencyDisplayComponent,
    LightboxComponent,
    UsdInfoComponent,
    RmbInfoComponent,
    EthInfoComponent,
    CoinInfoComponent,
    SocialBarComponent,
    CountryPickerComponent
  ]
})
export class ComponentsModule { }
