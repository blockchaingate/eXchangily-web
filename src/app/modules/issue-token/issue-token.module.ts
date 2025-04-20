import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IssueTokenRoutingModule } from './issue-token-routing.module';
import { IssueTokenComponent } from './issue-token.component';
import { IssueTokenFrc20Component } from './frc20/frc20.component';
import { IssueTokenHistoryComponent } from './history/history.component';
import { SharedModule } from '../shared/shared.module';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { UpdateComponent } from './update/update.component';

@NgModule({
    declarations: [
        IssueTokenComponent,
        IssueTokenFrc20Component,
        IssueTokenHistoryComponent,
        FileUploadComponent,
        UpdateComponent
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