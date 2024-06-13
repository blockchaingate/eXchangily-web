import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionHistoryComponent } from './transaction-history.component';

const routes: Routes = [
    { 
        path: '', component: TransactionHistoryComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    providers: [],
    exports: [RouterModule]
})
export class TransactionHistoryRoutingModule {

}
