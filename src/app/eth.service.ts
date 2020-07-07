import { Injectable } from '@angular/core';
import { $ } from 'protractor';
const Web3 = require('web3'); 

declare let require: any;
declare let window: any;

let verifierABIFile = require('../abi/AddressVerifier.json');
let verifierABI = verifierABIFile.abi; 

@Injectable({
  providedIn: 'root'
})
export class EthService {

  public _account: string = null;
  private _web3: any;

  private _verifierContract: any;
  private _verifierContractAddress: string = "0x6cB0C10dbE0Fd39d9E10f0Bc08f27Bb2694E07d5";

  constructor() {
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this._web3 = new Web3(window.web3.currentProvider);
      console.log("provider " + this._web3);

      

    } else {
      console.warn(
        'Please use a dapp browser like mist or MetaMask plugin for chrome'
      );
    }

    this._verifierContract = new this._web3.eth.Contract(verifierABI,this._verifierContractAddress);
  }

  public async getAccount(): Promise<string> {
    if (this._account == null) {
      this._account = await new Promise((resolve, reject) => {
        this._web3.eth.getAccounts((err, accs) => {
          if (err != null) {
            alert('There was an error fetching your accounts.');
            return;
          }
  
          if (accs.length === 0) {
            alert(
              'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'
            );
            return;
          }
          resolve(accs[0]);
        })
      }) as string;
  
      this._web3.eth.defaultAccount = this._account;
    }
  
    return Promise.resolve(this._account);
  }

  public getCurrentAccount(){
    return this._web3.eth.defaultAccount;
  }

  public accountSet() :boolean{
    if(this._web3.eth.defaultAccount != null && this._web3.eth.defaultAccount != undefined 
      && this._web3.eth.defaultAccount != ""){
        return true;
      }
      return false;
  }

  public verifyAddress(vc:any) {
    if(this._verifierContract != null){

      var iss = vc.payload.iss;
      var sub = vc.payload.sub;
      var signature = vc.signature;

      var header = JSON.stringify(vc.header);
      var payload = JSON.stringify(vc.payload);

      var stringToHash = header + "." + payload;

      var hash = this._web3.utils.soliditySha3(stringToHash); //calculate hash

    /* this._verifierContract.methods
     .isVerified("0xcf87ce923fe20968F491556Df7833C948400d68a")
      .call()
      .then(function(receipt){alert(receipt)}); */

     return this._verifierContract.methods.verify(sub,iss,hash,signature) //call contract method
      .send({
          from: this._account
      }/*,function(error){
         if(error){
          alert("An error eccourred. Couldn't validate given address");
          return false;
         } else {
          return true;
         }
      }*/)
     /* .err(()=>{
        alert("An error eccourred. Couldn't validate given address");
      })*/; 
    } 
  }

 

  /*public async getUserBalance(): Promise<number> {
    let account = await this.getAccount();
  
    return new Promise((resolve, reject) => {
      let _web3 = this._web3;
      this._tokenContract.balanceOf.call(account, function (err, result) {
        if(err != null) {
          reject(err);
        }
  
        resolve(_web3.fromWei(result));
      });
    }) as Promise<number>;
  }*/
  
}
