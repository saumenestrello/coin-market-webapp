import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EthService } from '../eth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor (private router: Router, private es : EthService){
  }

  onClick(event:any): void {

    switch(event.srcElement.id){
      case "verify-btn":
        this.router.navigateByUrl("/address-verifier");
        break;
      case "buy-token-btn":
        break;
    }
  }

  ngOnInit() {
   /* if(this.es._account != "" && this.es._account != null){
      document.getElementById("web3-account").innerText += this.es._account;
    } */
  }


  

}
