import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LoginRoutingModule } from './login-routing.module';
import { ComponentsModule } from '../../components/components.module';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
// import { AccountComponent } from './features/account/account.component';
import { ResetComponent } from './reset/reset.component';
import { ActivateComponent } from './activate/activate.component';
import { NoAuthGuard } from '../../guards/no-auth/no-auth.guard';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { WalletService } from '../.../../../../../services/wallet.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StorageService } from '../../../../services/storage.service';

import { CoinService } from '../../../../services/coin.service';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ComponentsModule,
    LoginRoutingModule,
    MatProgressSpinnerModule,
    FormsModule
  ],
  providers: [
    NoAuthGuard,
    StorageService,
    WalletService,
    CoinService
  ],
  declarations: [LoginComponent, SignupComponent, SigninComponent, ResetComponent, ActivateComponent, ChangePasswordComponent,]
})
export class LoginModule { }
