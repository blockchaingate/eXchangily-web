
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { StorageModule } from '@ngx-pwa/local-storage';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule  } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
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
import { SubscriptionComponent } from './modules/landing/features/subscription/subscription.component';
import { HelpComponent } from './components/help/help.component';

import { HttpService } from './services/http.service';
import { AlertService } from './services/alert.service';
import { UtilService } from './services/util.service';
import { KanbanService } from './services/kanban.service';
import { ApiService } from './services/api.service';
import { SubscriptionService } from './services/subscription.service';

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
    FooterComponent,
    SubscriptionComponent
  ],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatListModule,
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
    SubscriptionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
