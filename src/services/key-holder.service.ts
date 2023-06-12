import { Injectable } from '@angular/core';
import { Cryptography, MergeKey } from './crypto.services';

var crypt = new Cryptography()

class Key{
  uid:string = "";
  publicKey:MergeKey;
  shared:MergeKey;

  constructor(uid:string ,publicKey:MergeKey){
    this.uid = uid;
    this.publicKey = publicKey;
    let priv = new MergeKey();
    priv.fromString((localStorage.getItem("pk")+""));        
    this.shared = crypt.modpowM(publicKey,priv,Number.parseInt(localStorage.getItem("p")+""));
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

  static AddKey(uid:string,pub:MergeKey){
    if(this.GetKey(uid).publicKey.keys.length == 0){
      console.log(pub);
      
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
    let ret = new Key("TEST WRONG", new MergeKey());
    this.keys.forEach(e=>{
      if(e.uid == uid){
        ret = e;
      }
    });
    // this.Update();
    return ret;
  }

}
