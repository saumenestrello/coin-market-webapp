import { Injectable } from '@angular/core';
//import * as Web3 from 'web3';
declare let Web3: any;
declare let require: any;
declare let window: any;

let verifierABI = "aba"; //require('./abi/VerifierAddress.json');

@Injectable({
  providedIn: 'root'
})
export class EthService {

  public _account: string = null;
  private _web3: any;

  private _verifierContract: any;
  private _verifierContractAddress: string = "0xbc84f3bf7dd607a37f9e5848a6333e6c188d926c";

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

    this._verifierContract = ""; //this._web3.eth.contract(verifierABI).at(this._verifierContractAddress);
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
