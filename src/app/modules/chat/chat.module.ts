import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ChatService } from './services/chat.service';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatHomeComponent } from './components/home/chat-home.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule,
        ChatRoutingModule
    ],
    providers: [
        ChatService
    ],
    declarations: [
        ChatHomeComponent
    ],
    exports: [
        ChatHomeComponent
    ]
})
export class ChatModule { }
