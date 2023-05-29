import { Injectable } from '@angular/core';
import { Cryptography } from './crypto.services';

var crypt = new Cryptography()

class Key{
  uid:string = "";
  publicKey:Number = 0;
  shared:number = 0;

  constructor(uid:string ,publicKey:number){
    this.uid = uid;
    this.publicKey = publicKey;
    this.shared = crypt.modpow(publicKey,Number.parseInt(localStorage.getItem("pk")+""),Number.parseInt(localStorage.getItem("p")+""));
  }
}


@Injectable({
  providedIn: 'root'
})
export class KeyHolderService {
  static keys:Key[] = [];

  constructor(){
    let s = localStorage.getItem("keys")
    if(s!=null){
      KeyHolderService.keys = JSON.parse(s);
    }
  }

  private static Update(){    
    localStorage.setItem("keys",JSON.stringify(this.keys));
  } 

  static AddKey(uid:string,pub:number){
    if(this.GetKey(uid).publicKey == -1){
      this.keys.push(new Key(uid,pub));
    }
    else{
      for (let i = 0; i < this.keys.length; i++) {
        const e = this.keys[i];
        if(e.uid == uid){
          this.keys[i] = new Key(uid,pub);
        }
      }
    }

    this.Update();
  }

  static GetKey(uid:string):Key{
    let ret = new Key("TEST WRONG", -1);
    this.keys.forEach(e=>{
      if(e.uid == uid){
        ret = e;
      }
    });
    // this.Update();
    return ret;
  }

}
