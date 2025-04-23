import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SmartContractComponent } from './pages/smart-contract/smart-contract.component';

const routes: Routes = [
    { 
        path: '', component: SmartContractComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    providers: [],
    exports: [RouterModule]
})
export class SmartContractRoutingModule {

}
