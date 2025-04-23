
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { StorageModule } from '@ngx-pwa/local-storage';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppResolver } from './modules/landing/resolvers/app/app.resolve';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { StorageService } from './services/storage.service';
import { TimerService } from './services/timer.service';
import { PageNotFoundComponent } from './page-not-found.component';
import { HeaderComponent } from './components/navigation/header/header.component';
import { FooterComponent } from './components/navigation/footer/footer.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FaqComponent } from './components/help/faq.component';
import { FeeComponent } from './components/help/fee.component';
import { SubscriptionComponent } from './modules/landing/features/subscription/subscription.component';
import { HelpComponent } from './components/help/help.component';

import { HttpService } from './services/http.service';
import { AlertService } from './services/alert.service';
import { UtilService } from './services/util.service';
import { KanbanService } from './services/kanban.service';
import { TicketService } from './services/ticket.service';
import { KycService } from './services/kyc.service';
import { ApiService } from './services/api.service';
import { SubscriptionService } from './services/subscription.service';
import { SupportComponent } from './modules/support/support.component';
import { TicketComponent } from './modules/support/ticket/ticket.component';
import { TicketAddComponent } from './modules/support/ticket-add/ticket-add.component';
import { NewsComponent } from './modules/news/news.component';
import { LanService } from './services/lan.service';
import { LoginInfoService } from './services/loginInfo.service';
import { CampaignOrderService } from './services/campaignorder.service';
import { LoginQualifyService } from './services/lgoin-quality.service';
import { AnnouncementsService } from './services/announcements.service';
import { AnnouncementListComponent } from './components/help/announcement/announcement-list/announcement-list.component';
import { AnnouncementComponent } from './components/help/announcement/announcement/announcement.component';
import { AppIntroComponent } from './modules/app-intro/app-intro.component';
import { ListingComponent } from './modules/listing/listing.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { DusdComponent } from './components/dusd/dusd.component';
import { DonwloadComponent } from './components/donwload/donwload.component';
import { WalletService } from './services/wallet.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    // TvChartContainerComponent,
    HeaderComponent,
    HelpComponent,
    FaqComponent,
    FeeComponent,
    FooterComponent,
    SubscriptionComponent,
    SupportComponent,
    TicketComponent,
    TicketAddComponent,
    NewsComponent,
    AnnouncementComponent,
    AnnouncementListComponent,
    AppIntroComponent,
    ListingComponent,
    PrivacyComponent,
    DusdComponent,
    DonwloadComponent
  ],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    MatSidenavModule,
    MatToolbarModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatMenuModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatTabsModule,
    RouterModule,
    MatSnackBarModule,
    MatButtonModule,
    TranslateModule.forRoot(
      {
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }
    ),
    StorageModule.forRoot({ IDBNoWrap: true, }),
    AppRoutingModule,
  ],
  providers: [AppResolver, HttpService, StorageService, TimerService, AlertService, UtilService, KanbanService, ApiService,
    SubscriptionService, TicketService,LanService,
    LoginInfoService,
    LoginQualifyService,
    CampaignOrderService,
    AnnouncementsService,
    KycService,
    WalletService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
