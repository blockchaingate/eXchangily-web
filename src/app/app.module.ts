import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { StorageModule } from '@ngx-pwa/local-storage';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { MarketModule } from './modules/market/market.module';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './app-routing.module';
import { AppResolver } from './modules/landing/resolvers/app/app.resolve';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { StorageService } from './services/storage.service';
import { TimerService } from './services/timer.service';
import { PageNotFoundComponent } from './page-not-found.component';
import { HeaderComponent } from './components/navigation/header/header.component';
import { FooterComponent } from './components/navigation/footer/footer.component';
import { SidenavListComponent } from './components/navigation/sidenav-list/sidenav-list.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { HttpService } from './services/http.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({ 
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    //TvChartContainerComponent,
    HeaderComponent,
    FooterComponent,
    SidenavListComponent
  ], 
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MarketModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,
    MatListModule,
    RouterModule,
    FormsModule,ReactiveFormsModule,
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
  providers: [AppResolver, HttpService, StorageService, TimerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
