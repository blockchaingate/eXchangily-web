import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IssueTokenRoutingModule } from './issue-token-routing.module';
import { IssueTokenComponent } from './issue-token.component';
import { IssueTokenFrc20Component } from './frc20/frc20.component';

@NgModule({
    declarations: [
        IssueTokenComponent,
        IssueTokenFrc20Component
    ],
    imports: [
        MatStepperModule,
        FormsModule,
        TranslateModule,
        ReactiveFormsModule,
        IssueTokenRoutingModule,
        MatButtonModule,
        MatInputModule,
        MatRadioModule
    ]
})

export class IssueTokenModule { }