import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MetaforceComponent } from './metaforce.component';

const routes: Routes = [
    { 
        path: '', component: MetaforceComponent
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
