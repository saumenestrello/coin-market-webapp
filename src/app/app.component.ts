import { Component,Inject } from '@angular/core';
import { Router } from '@angular/router';
import { EthService } from './eth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'webapp';

  constructor (private router: Router, private es: EthService){
  }

  async ngOnInit() { 
    document.getElementById("spinner").style.setProperty("display","visible");
    await this.es.getAccount()
    .then(()=>{
      document.getElementById("address").innerHTML = this.es.getCurrentAccount();
      document.getElementById("spinner").style.setProperty("display","none");
      document.getElementById("nav").style.setProperty("display","initial");
      this.router.navigateByUrl("/home");
    });
  }

  goToHome(){
    this.router.navigateByUrl("/home");
  }

}

