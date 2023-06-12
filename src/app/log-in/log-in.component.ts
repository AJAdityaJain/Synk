import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Cryptography, MergeKey } from 'src/services/crypto.services';
import { Data } from 'src/models/Data';
@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})

export class LogInComponent {

  constructor(private http:HttpClient, private cr:Cryptography, private router:Router ){}

  

  SignIn(){ 
    
    let pw = (document.getElementById("inpw")as HTMLInputElement).value+"";
    let email = (document.getElementById("inemail")as HTMLInputElement).value+"";
    this.http.get<Data>('/api/User/Login/'+email+'?pw='+pw)
    .subscribe(data => {
      if(data.code == "DONE"){
        localStorage.setItem("pk",this.cr.decrypt(data.value.encrypted,/*email.toUpperCase()+*/pw))
        localStorage.setItem("SID",data.value.sid)
        this.router.navigateByUrl("/main");
      }
      else if(data.code == "ERRO"){
        this.router.navigateByUrl("/error")
      }

    })    
  }

  SignUp(){
    let pw = (document.getElementById("uppw")as HTMLInputElement).value+"";

    let p = Number.parseInt(localStorage.getItem("p")+"");
    let g = Number.parseInt(localStorage.getItem("g")+"");
    let privatekey = new MergeKey();
    privatekey.generate(16);
    let publickey = this.cr.modpowM(g,privatekey,p); 

    
    let user = {
      username:(document.getElementById("upname")as HTMLInputElement).value+"",
      email:(document.getElementById("upemail")as HTMLInputElement).value+"",
      hash:pw,
      encryptedKey:this.cr.encrypt(privatekey.toString(),/*user.email.toUpperCase()+*/pw),
      publicKey:publickey.toString()
    };
    
    console.log(privatekey,g,p);
    console.log(publickey);
    console.log(user);
    
    this.http.post<Data>('/api/User/Create',user)
    .subscribe(data => {
      console.log(data);
      
      if(data.code == "DONE"){
        localStorage.setItem("SID",data.value)
        localStorage.setItem("pk",privatekey.toString());

      }
      else if(data.code == "ERRO"){
        this.router.navigateByUrl("/error")
      }
    })
  }
}
