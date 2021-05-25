import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {MatIconModule} from '@angular/material/icon';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IssueTokenRoutingModule } from './issue-token-routing.module';
import { IssueTokenComponent } from './issue-token.component';
import { IssueTokenFrc20Component } from './frc20/frc20.component';
import { IssueTokenHistoryComponent } from './history/history.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        IssueTokenComponent,
        IssueTokenFrc20Component,
        IssueTokenHistoryComponent
    ],
    imports: [
        MatStepperModule,
        FormsModule,
        MatIconModule,
        CommonModule,
        TranslateModule,
        ReactiveFormsModule,
        IssueTokenRoutingModule,
        MatButtonModule,
        MatInputModule,
        MatRadioModule,
        SharedModule
    ]
})

export class IssueTokenModule { }