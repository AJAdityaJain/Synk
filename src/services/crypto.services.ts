import { Injectable } from '@angular/core';
import * as crypto from "crypto-js";


export class MergeKey{
  
  keys:number[] = [];

  generate(n:number){
    let p = Number.parseInt(localStorage.getItem("p")+"");

    for (let i = 0; i < n; i++) {
      this.keys.push(Math.floor(Math.random() *  p));
    }
  }

  duplicate(){
    let r  = new MergeKey();
    this.keys.forEach(e=>r.keys.push(e));
    return r;
  }

  fromString(s:string){
    this.keys = [];
    let ss = s.split("_");
    ss.forEach(e=>{
      if(e.length > 0){
        this.keys.push(Number.parseInt(e));
      }
    })
  }

  toString(){
    let s = "";
    this.keys.forEach(e=>{
      s+="_"+e.toString()
    });
    return s;
  }
}


@Injectable({
  providedIn: 'root'
})
export class Cryptography {
  IV = crypto.enc.Utf8.parse("dawg");

  constructor() {    
  }
  
  applySecrecy(x:MergeKey):MergeKey[]{
    let p = Number.parseInt(""+localStorage.getItem("p"));
    let y = new MergeKey();
    y.generate(16);
    return [this.modpowM(y,x,p),y];
  }

  getSecrecy(x:MergeKey, key:MergeKey):MergeKey{
    let p = Number.parseInt(""+localStorage.getItem("p"));
    return this.modpowM(key,x,p);
  }
  
  modpowM(x:MergeKey|number, n:MergeKey, mod?:number) :MergeKey {
    let nd = n.duplicate();
    if(!(typeof x == 'number')){
      for (let i = 0; i < x.keys.length; i++) {
        nd.keys[i] = this._modpow(x.keys[i],nd.keys[i],mod)
      }
    }
    else{
      console.log((x), "NOOOOOOOOOOOOOO DUUUUUUDE");
      
      for (let i = 0; i < n.keys.length; i++) {
        nd.keys[i] = this._modpow(x,nd.keys[i],mod);
      }
    }

    return nd;
  }
  
  _modpow(x:number, n:number, mod?:number) :number {
    
    let bigX = BigInt(x);
    let bigN = BigInt(n);  
    if (mod) {
      const bigMod = BigInt(mod);
      let result = BigInt(1);
  
      while (bigN > 0) {
        if (bigN % BigInt(2) == BigInt(1)) {
          result = (result * bigX) % bigMod;
        }
        bigX = (bigX * bigX) % bigMod;
        bigN /= BigInt(2);
      }
      return Number(result);
    } else {
      let result = BigInt(1);
      while (bigN > 0) {
        if (bigN % BigInt(2) == BigInt(1)) {
          result *= bigX;
        }
        bigX *= bigX;
        bigN /= BigInt(2);
      }
      return Number(result);
    }
  }



  encrypt(text:string, key:string):string{
    return crypto.AES.encrypt(text,key,{iv:this.IV,
}).toString();
  }

  decrypt(text:string, key:string):string{
    return crypto.AES.decrypt(text,key,{iv:this.IV,
}).toString(crypto.enc.Utf8);
  }



  deprecated_hash(text:string):string{
    return crypto.SHA256(text).toString()
  }

}