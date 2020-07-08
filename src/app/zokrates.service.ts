import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { initialize } from 'zokrates-js';

const BitSet = require('bitset');
const crypto = require('crypto');
const SHA256 = s => crypto.createHash('sha256').update(s, 'utf8').digest('hex')
const SHA256Raw = s => crypto.createHash('sha256').update(s, 'utf8').digest()

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
      var build = this.compile()
      .then((build) => {
        var program = build['program'];
        var setup = this.setup(program);
      });
      
     // var witness = this.computeWitness(build);
     // var proof = this._zokratesProvider.generateProof(build['program'],witness,setup['pk']);
    } else {
      console.log('ERROR: zokrates provider hasn\'t been initialized');
    }
  }

  private compile(){
    var build = this._zokratesProvider.compile(this._circuit, "main", this.importResolver);
    console.log('zokrates compile executed');
    return new Promise(build);
  }

  private computeWitness(artifacts){
    var witness = this._zokratesProvider.computeWitness(artifacts,this._zokratesInputs);
    console.log('zokrates compute witness executed');
    return witness;
  }

  private setup(program){
    var setup = this._zokratesProvider.setup(program);
    console.log('zokrates setup executed');
    return setup;
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

    //leaf 0
    var leaf0KeyRaw = SHA256Raw('cf');
    hex = '0x' + SHA256('cf');
    bits = (new BitSet(hex)).toString();
    var leaf0Key = bits.padStart(256,'0');

    var leaf0ValueRaw = SHA256Raw(csu['cf']);
    hex = '0x' + SHA256(csu['cf']);
    bits = (new BitSet(hex)).toString();
    var leaf0Value = bits.padStart(256,'0');

    var concat0 = Buffer.concat([leaf0KeyRaw,leaf0ValueRaw]);
    var leaf0Raw = SHA256Raw(concat0);
    hex = '0x' + SHA256(concat0);
    bits = (new BitSet(hex)).toString();
    var leaf0 = bits.padStart(256,'0');

    //leaf 1
    var leaf1KeyRaw = SHA256Raw('nat');
    hex = '0x' + SHA256('nat');
    bits = (new BitSet(hex)).toString();
    var leaf1Key = bits.padStart(256,'0');

    var leaf1ValueRaw = SHA256Raw(csu['nationality']);
    hex = '0x' + SHA256(csu['nationality']);
    bits = (new BitSet(hex)).toString();
    var leaf1Value = bits.padStart(256,'0');

    var concat1 = Buffer.concat([leaf1KeyRaw,leaf1ValueRaw]);
    var leaf1Raw = SHA256Raw(concat1);
    hex = '0x' + SHA256(concat1);
    bits = (new BitSet(hex)).toString();
    var leaf1 = bits.padStart(256,'0');

    var concat2 = Buffer.concat([leaf0Raw,leaf1Raw]);
    var subtree0Raw = SHA256Raw(concat2);
    hex = '0x' + SHA256(subtree0Raw);
    bits = (new BitSet(hex)).toString();
    var subtree0 = bits.padStart(256,'0');

    //subtree 1

    //leaf 2
    var leaf2KeyRaw = SHA256Raw('iss');
    hex = '0x' + SHA256('iss');
    bits = (new BitSet(hex)).toString();
    var leaf2Key = bits.padStart(256,'0');

    var leaf2ValueRaw = SHA256Raw(vc['payload']['iss'])
    hex = '0x' + SHA256(vc['payload']['iss']);
    bits = (new BitSet(hex)).toString();
    var leaf2Value = bits.padStart(256,'0');

    var concat3 = Buffer.concat([leaf2KeyRaw,leaf2ValueRaw]);
    var leaf2Raw = SHA256Raw(concat3);
    hex = '0x' + SHA256(concat3);
    bits = (new BitSet(hex)).toString();
    var leaf2 = bits.padStart(256,'0');

    //leaf 3
    var leaf3KeyRaw = SHA256Raw('sub');
    hex = '0x' + SHA256('sub');
    bits = (new BitSet(hex)).toString();
    var leaf3Key = bits.padStart(256,'0');

    var leaf3ValueRaw = SHA256Raw(vc['payload']['sub']);
    hex = '0x' + SHA256(vc['payload']['sub']);
    bits = (new BitSet(hex)).toString();
    var leaf3Value = bits.padStart(256,'0');

    var concat4 = Buffer.concat([leaf3KeyRaw,leaf3ValueRaw]);
    var leaf3Raw = SHA256Raw(concat4);
    hex = '0x' + SHA256(concat4);
    bits = (new BitSet(hex)).toString();
    var leaf3 = bits.padStart(256,'0');

    var concat5 = Buffer.concat([leaf2Raw,leaf3Raw]);
    var subtree1Raw = SHA256Raw(concat5);
    hex = '0x' + SHA256(concat5);
    bits = (new BitSet(hex)).toString();
    var subtree1 = bits.padStart(256,'0');

    //merkle root

    var concat6 = Buffer.concat([subtree0Raw,subtree1Raw]);
    var merkleRootRaw = SHA256Raw(concat6);
    hex = '0x' + SHA256(concat6);
    bits = (new BitSet(hex)).toString();
    var merkleRoot = bits.padStart(256,'0');

    //extract Eddsa signature parameters

    this._signature = vc["signature"];
    var sigPieces = vc["signature"].split(' ',5);
    this._R = [sigPieces[0],sigPieces[1]];
    this._S = sigPieces[2];
    this._A = [sigPieces[3],sigPieces[4]];
    
    var index = sigPieces.join(' ').length;
    var message = vc["signature"].slice(index + 1);
    message = message.split(' ');
    message = message.join('');
    this._M0 = message.substring(0,(message.length/2)).split('');
    this._M1 = message.substring((message.length/2)).split('');

    //prepare data for zokrates
    this._leaf0KeyHash = leaf0Key.split('');
    this._leaf0ValueHash = leaf0Value.split('');
    this._leaf1Hash = leaf1.split('');
    this._subtree1Hash = subtree1.split('');
    this._merkleRoot = merkleRoot.split('');

     /*   console.log(
        this._leaf0KeyHash.join(' ') + ' ' +
        this._leaf0ValueHash.join(' ') + ' ' +
        this._leaf1Hash.join(' ') + ' ' +
        this._subtree1Hash.join(' ') + ' ' +
        this._merkleRoot.join(' ')); */

    

    var stringInputs = [];
    stringInputs.push(this._leaf0KeyHash);
    stringInputs.push(this._leaf0ValueHash);
    stringInputs.push(this._leaf1Hash);
    stringInputs.push(this._subtree1Hash);
    stringInputs.push(this._merkleRoot);
    stringInputs.push(this._R);
    stringInputs.push(this._S);
    stringInputs.push(this._A);
    stringInputs.push(this._M0);
    stringInputs.push(this._M1);

    this._zokratesInputs = stringInputs;

  }
}
