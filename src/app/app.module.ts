import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { StorageModule } from '@ngx-pwa/local-storage';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MarketModule } from './modules/market/market.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found.component';
import {TvChartContainerComponent} from './components/tv-chart-container/tv-chart-container.component';
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    TvChartContainerComponent
  ], 
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MarketModule,
    BsDropdownModule.forRoot(),
    NgbModule,
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
