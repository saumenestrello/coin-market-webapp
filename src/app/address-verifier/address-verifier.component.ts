import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { EthService } from '../eth.service';
import { ZokratesService } from '../zokrates.service';

@Component({
  selector: 'address-verifier',
  templateUrl: './address-verifier.component.html',
  styleUrls: ['./address-verifier.component.css']
})
export class AddressVerifierComponent implements OnInit {

  private textVC: string;

  constructor(private es : EthService, private zok: ZokratesService) { }

  ngOnInit() {
  }

  uploadVC() {
    var file = $('#VC').prop('files')[0];
    var reader = new FileReader();

    reader.onload = function () {
      this.textVC = reader.result;

      document.getElementById("no-preview-wrapper").style.setProperty("display", "none");
      document.getElementById("result").style.setProperty("display", "initial");
      document.getElementById("result").innerText = this.textVC;

    }.bind(this);

    reader.readAsText(file);

  }

  verifyVC(): boolean {

    var jsonVC = JSON.parse(this.textVC);

    this.zok.parseVC(jsonVC);
    this.zok.generateProof().then(()=>{
      console.log('proof generated with success');
    });

    this.es.verifyAddress(jsonVC)
    .then((res)=>{
      if(res.status){
        $("#custom-bar").removeClass("verification-inactive");
        $("#custom-bar").addClass("verification-active");
        document.getElementById("success-msg-tab").style.setProperty("display", "inherit");
      } else {
        document.getElementById("error-msg-tab").style.setProperty("display", "inherit");
      }
    });

    return true;
  }

  clearScreen() {

    $("#VC").val("");
    var parEle = $("#VC").parent();
    var newEle = $("#VC").clone()
    $("#VC").remove();
    $(parEle).prepend(newEle);

    document.getElementById("result").style.setProperty("display", "none");
    document.getElementById("result").innerText = "";
    this.textVC = "";
    document.getElementById("no-preview-wrapper").style.setProperty("display", "flex");

    $("#custom-bar").addClass("verification-inactive");
    $("#custom-bar").removeClass("verification-active");

    document.getElementById("success-msg-tab").style.setProperty("display", "none");
    document.getElementById("error-msg-tab").style.setProperty("display", "none");
  }

}
