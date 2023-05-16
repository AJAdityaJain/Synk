import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Cryptography } from 'src/services/crypto.services';
import { User } from 'src/models/User';
import { Data } from 'src/models/Data';
@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})

export class LogInComponent {

  constructor(private http:HttpClient, private cr:Cryptography, private router:Router ){
    // console.log(cr.modpow(1675476,2959741,4692757));
    // console.log(cr.modpow(564318,3128404 ,4692757));
  }

  ngOnInit(){
    let sid = localStorage.getItem("SID");
    if(sid != null){
      this.http.get<Data>('http://localhost:4200/api/User/AutoLoginUser?sid='+sid)
      .subscribe(data => {
        if(data.code == "DONE"){
          this.router.navigateByUrl("/main");
        }
      }) 
    }
    
  }

  SignIn(){ 
    
    let pw = (document.getElementById("inpw")as HTMLInputElement).value+"";
    let email = (document.getElementById("inemail")as HTMLInputElement).value+"";
    this.http.get<Data>('http://localhost:4200/api/User/LoginUser?email='+email+'&hash='+this.cr.hash(email.toUpperCase()+pw))
    .subscribe(data => {
      console.log(data);
      if(data.code == "DONE"){
        localStorage.setItem("pk",this.cr.decrypt(data.value.encrypted,/*email.toUpperCase()+*/pw))
        localStorage.setItem("SID",data.value.sid)
        this.router.navigateByUrl("/main");
      }
    })    
  }

  SignUp(){
    let user = new User();
    
    let pw = (document.getElementById("uppw")as HTMLInputElement).value+"";

    let p = Number.parseInt(localStorage.getItem("p")+"");
    let g = Number.parseInt(localStorage.getItem("g")+"");
    let privatekey = Math.floor(Math.random() *  p);
    let publickey = this.cr.modpow(g,privatekey,p); 


    localStorage.setItem("pk",privatekey.toString());
    user.encryptedKey = this.cr.encrypt(privatekey.toString(),/*user.email.toUpperCase()+*/pw);
    user.publicKey = publickey;
    user.username = (document.getElementById("upname")as HTMLInputElement).value+"";
    user.email = (document.getElementById("upemail")as HTMLInputElement).value+"";
    user.hash = this.cr.hash(user.email.toUpperCase()+pw);

    
    console.log(privatekey,g,p);
    console.log(publickey);
    console.log(user);
    
    this.http.post<Data>('http://localhost:4200/api/User/CreateUser',user)
    .subscribe(data => {
      console.log(data);
      
      if(data.code == "DONE")
        localStorage.setItem("SID",data.value)
    })
  }
}
