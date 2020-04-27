import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { AddressVerifierComponent } from './address-verifier/address-verifier.component';
import { HomeComponent } from './home/home.component';
import { Web3ErrorComponent } from './web3-error/web3-error.component';



@NgModule({
  declarations: [
    AppComponent,
    AddressVerifierComponent,
    HomeComponent,
    Web3ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
