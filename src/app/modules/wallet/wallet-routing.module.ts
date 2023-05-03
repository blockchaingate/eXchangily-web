import { Injectable, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { Observable, Observer } from 'rxjs';

import { WalletService } from '../../services/wallet.service';
import { CoinService } from '../../services/coin.service';
import { ApiService } from '../../services/api.service';
import { UtilService } from '../../services/util.service';

import { WalletComponent } from './wallet.component';
import { NoWalletComponent } from './components/create/no-wallet.component';
import { CreateWalletComponent } from './components/create/createwallet.component';
import { ConfirmMnemonicsComponent } from './components/create/confirmmnem.component';
import { WalletPwdComponent } from './components/create/wallet-pwd.component';
import { RestoreWalletComponent } from './components/restore/restorewallet.component';
import { RestoreWalletOldComponent } from './components/restoreold/restorewalletold.component';
import { WalletDashboardComponent } from './components/dashboard/dashboard.component';
import { KycComponent } from './components/kyc/kyc.component';
import { KycProcessComponent } from './components/kyc-process/kyc-process.component';

@Injectable()
export class CanActivateTeam implements CanActivate {
    constructor(private walletService: WalletService, private router: Router) {
    }

    // Route to default page when it does not log in.
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return new Observable((ob: Observer<boolean>) => {
            if (!this.walletService.getWalletStatus()) {
                this.router.navigateByUrl('');
            }
        });

    }
}

const routes: Routes = [
    {
        path: '', component: WalletComponent,
        children: [
            { path: 'dashboard', component: WalletDashboardComponent },
            { path: 'create', component: CreateWalletComponent },
            { path: 'no-wallet', component: NoWalletComponent },
            { path: 'confirm-words', component: ConfirmMnemonicsComponent },
            { path: 'set-password', component: WalletPwdComponent },
            { path: 'restore', component: RestoreWalletComponent },
            { path: 'restoreold', component: RestoreWalletOldComponent },
            { path: 'kyc', component: KycComponent },
            { path: 'kyc-process', component: KycProcessComponent },
            { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

        ]
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    providers: [CanActivateTeam, WalletService, CoinService, ApiService, UtilService],
    exports: [RouterModule]
})
export class WalletRoutingModule {
    /*
    constructor(private router: Router) {
        this.router.errorHandler = () => {
            this.router.navigateByUrl('dashboard');
        };
    }
    */
}
