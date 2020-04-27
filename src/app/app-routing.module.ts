import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AddressVerifierComponent } from './address-verifier/address-verifier.component';
import { HomeComponent } from './home/home.component';
import { AccountGuard } from './account.guard';
import { Web3ErrorComponent } from './web3-error/web3-error.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AccountGuard]
  },
  {
    path: 'address-verifier',
    component: AddressVerifierComponent,
    canActivate: [AccountGuard]
  },
  {
    path: 'web3-error',
    component: Web3ErrorComponent
  }
];
 
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
