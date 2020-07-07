import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { initialize } from 'zokrates-js';

const BitSet = require('bitset');
const crypto = require('crypto');

@Injectable({
  providedIn: 'root'
})
export class ZokratesService {

  private _zokratesProvider : any;

  private _circuit: string;
  private _vc: JSON;

  private _leaf0KeyHash: any;
  private _leaf0ValueHash: any;
  private _leaf1Hash: any;
  private _subtree1Hash: any;
  private _merkleRoot: any;
  private _R: any;
  private _S: any;
  private _A: any;
  private _M0: any;
  private _M1: any;
  private _signature: any;

  private _zokratesInputs: any;

  constructor(private http: HttpClient) { 
    http.get('../assets/vc_proof_generator.txt',{ responseType: 'text' }).subscribe(data => {
      this._circuit = data;  
      this.init();
    });
  }

  private init(){
    initialize().then((zokratesProvider) => {
        this._zokratesProvider = zokratesProvider;
        console.log('zokrates provider initialized')
    });
  }

  public async generateProof(){
    if(this._zokratesProvider != undefined){
      var build = this.compile();
      var witness = this.computeWitness(build);
    } else {
      console.log('ERROR: zokrates provider hasn\'t been initialized');
    }
  }

  private compile(){
    var build = this._zokratesProvider.compile(this._circuit, "main", this.importResolver);
    console.log('zokrates compile executed');
    return build;
  }

  private computeWitness(artifacts){
    var witness = this._zokratesProvider.computeWitness(artifacts,this._zokratesInputs);
    console.log('zokrates compute witness executed');
    return witness;
  }

  private importResolver(location, path) {
    // implement your resolving logic here
    return { 
      source: this._circuit, 
      location: path 
    };
  }

  public parseVC(vc:JSON){

    //extract merkle tree parameters for Zokrates circuit

    var hex,bits;

    this._vc = vc;
    var csu = vc["payload"]["csu"];

    //subtree 0

    var leaf0, leaf0Key, leaf0Value, leaf1, subtree0;

    var hasher = crypto.createHash('sha256');
    hasher.update('cf','utf-8');
    hex = '0x' + hasher.digest('hex');
    bits = (new BitSet(hex)).toString();
    leaf0Key = bits.padStart(256,'0');

    hasher = crypto.createHash('sha256');
    hasher.update(csu['cf'],'utf-8');
    hex = '0x' + hasher.digest('hex');
    bits = (new BitSet(hex)).toString();
    leaf0Value = bits.padStart(256,'0');

    hasher = crypto.createHash('sha256');
    hasher.update(leaf0Key,'utf-8');
    hasher.update(leaf0Value,'utf-8');
    hex = '0x' + hasher.digest('hex');
    bits = (new BitSet(hex)).toString();
    leaf0 = bits.padStart(256,'0');

    hasher = crypto.createHash('sha256');
    hasher.update('nationality','utf-8');
    hasher.update(csu['nationality'],'utf-8');
    hex = '0x' + hasher.digest('hex');
    bits = (new BitSet(hex)).toString();
    leaf1 = bits.padStart(256,'0');

    hasher = crypto.createHash('sha256');
    hasher.update(leaf0,'utf-8');
    hasher.update(leaf1,'utf-8');
    hex = '0x' + hasher.digest('hex');
    bits = (new BitSet(hex)).toString();
    subtree0 = bits.padStart(256,'0');

    //subtree 1

    var leaf2, leaf3, subtree1, merkleRoot;

    hasher = crypto.createHash('sha256');
    hasher.update('iss','utf-8');
    hasher.update(vc['payload']['iss'],'utf-8');
    hex = '0x' + hasher.digest('hex');
    bits = (new BitSet(hex)).toString();
    leaf2 = bits.padStart(256,'0');

    hasher = crypto.createHash('sha256');
    hasher.update('sub','utf-8');
    hasher.update(vc['payload']['sub'],'utf-8');
    hex = '0x' + hasher.digest('hex');
    bits = (new BitSet(hex)).toString();
    leaf3 = bits.padStart(256,'0');

    hasher = crypto.createHash('sha256');
    hasher.update(leaf2,'utf-8');
    hasher.update(leaf3,'utf-8');
    hex = '0x' + hasher.digest('hex');
    bits = (new BitSet(hex)).toString();
    subtree1 = bits.padStart(256,'0');

    //merkle root

    hasher = crypto.createHash('sha256');
    hasher.update(subtree0);
    hasher.update(subtree1);
    hex = '0x' + hasher.digest('hex');
    bits = (new BitSet(hex)).toString();
    merkleRoot = bits.padStart(256,'0');

    //extract Eddsa signature parameters

    this._signature = vc["signature"];

    //prepare data for zokrates
    this._leaf0KeyHash = leaf0Key.split('').join(' ');
    this._leaf0ValueHash = leaf0Value.split('').join(' ');
    this._leaf1Hash = leaf1.split('').join(' ');
    this._subtree1Hash = subtree1.split('').join(' ');
    this._merkleRoot = merkleRoot.split('').join(' ');

    var stringInputs = 
        this._leaf0KeyHash + ' ' +
        this._leaf0ValueHash + ' ' +
        this._leaf1Hash + ' ' +
        this._subtree1Hash + ' ' +
        this._merkleRoot + ' ' +
        this._signature;

    this._zokratesInputs = stringInputs.split(' ');

  }
}
