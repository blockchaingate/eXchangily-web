import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileRoutingModule } from './mobile-routing.module';
import { MobileComponent } from './mobile.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
declarations: [
    MobileComponent
],
imports: [
    CommonModule,
    MobileRoutingModule,
    BrowserModule
],
bootstrap: [MobileComponent]
})
export class MobileModule { }
