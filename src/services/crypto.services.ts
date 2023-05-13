import { Injectable } from '@angular/core';
import * as crypto from "crypto-js";

@Injectable({
  providedIn: 'root'
})

export class Cryptography {
  constructor() { }
  
  modpow(x:number, n:number, mod?:number) :number {
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
    return text;crypto.DES.encrypt(text,key).toString();
  }

  decrypt(text:string, key:string):string{
    return text;crypto.DES.decrypt(text,key).toString();//crypto.enc.Utf8);
  }

  hash(text:string):string{
    return crypto.SHA256(text).toString()
  }
}