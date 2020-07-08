import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletComponent } from './wallet.component';
import { WalletRoutingModule } from './wallet-routing.module';
@NgModule({
declarations: [
    WalletComponent
],
imports: [
    CommonModule,
    WalletRoutingModule
]
})
export class WalletModule { }