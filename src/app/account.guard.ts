import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, 
RouterStateSnapshot } from '@angular/router';
import { EthService } from './eth.service';
import { TouchSequence } from 'selenium-webdriver';

@Injectable({
    providedIn: 'root'
  })
export class AccountGuard implements CanActivate {

constructor(private router: Router,private es: EthService) { }

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) 
:boolean{   
    
    if(state.url == "/home") {
        document.getElementById("back-button").style.setProperty("display", "none");
    } else {
        document.getElementById("back-button").style.setProperty("display", "inline-block");
    }

    if(!this.es.accountSet()){
        this.es.getAccount().then(()=>{
            var check = this.es.accountSet();
            if(check){
                document.getElementById("address").innerText = this.es.getCurrentAccount();
                return true;
            } else {
                this.router.navigateByUrl("/web3-error");
                return false;
            }
        })
    } else {
        return true;
    }
  }
 }