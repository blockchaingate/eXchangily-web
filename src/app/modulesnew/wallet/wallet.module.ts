import { NgModule }      from '@angular/core';
import { WalletComponent } from './wallet.component';
import { OverviewComponent } from './components/overview/overview.component';
import { AssetsComponent } from './components/assets/assets.component';
import { ToolsComponent } from './components/tools/tools.component';
import { FaqComponent } from './components/faq/faq.component';
import {  RouterModule, Routes } from '@angular/router';
const routes: Routes = [
{ path: '', component: WalletComponent}
];
@NgModule({
    imports:      [ RouterModule.forChild(routes) ],
    providers:    [  ],
    declarations: [
        WalletComponent,
        OverviewComponent,
        AssetsComponent,
        ToolsComponent,
        FaqComponent
    ],
    exports:      [  ],
    bootstrap:    [ WalletComponent ]
})
export class WalletNewModule {

}