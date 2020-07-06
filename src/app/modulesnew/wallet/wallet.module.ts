import { NgModule }      from '@angular/core';
import { WalletComponent } from './wallet.component';
import {  RouterModule, Routes } from '@angular/router';
const routes: Routes = [
{ path: '', component: WalletComponent}
];
@NgModule({
imports:      [ RouterModule.forChild(routes) ],
providers:    [  ],
declarations: [ WalletComponent ],
exports:      [  ],
bootstrap:    [ WalletComponent ]
})
export class WalletNewModule {

}