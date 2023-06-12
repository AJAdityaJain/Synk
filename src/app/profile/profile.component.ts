import { Cryptography, MergeKey } from 'src/services/crypto.services';
import { User } from 'src/models/User';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Data } from 'src/models/Data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  user:User;

  constructor(private http:HttpClient, private router:Router ,private cr:Cryptography){
    this.user= new User();
  }

  largePFP(){
    this.http.get<Data>("/api/User/GetPFPLarge/"+localStorage.getItem("SID")+"?uid="+this.user.uid).subscribe(data=>{
      (document.getElementById("pfp")as HTMLImageElement).src = ("data:image/jpeg;base64,"+data.value);      
    })
  }
  
  ngOnInit(){
    (document.getElementById("pfp")as HTMLImageElement).src = "data:image/jpeg;base64,"+ this.user.pfp;
    
    setTimeout(() => {
      console.log("ERROR SPREE");
      
      if(localStorage.getItem("userData") == undefined){
        this.SetUserData()
      }        
      else{
        this.user = JSON.parse(localStorage.getItem("userData")+"");
        (document.getElementById("pfp")as HTMLImageElement).src = "data:image/jpeg;base64,"+ this.user.pfp;
      }
    }, 1000);
  }

  
  SetUserData(){
    this.http.get<Data>("/api/User/GetFromSession/"+localStorage.getItem("SID")).subscribe(data=>{
      if(data.code == "DONE"){
        localStorage.setItem("userData",JSON.stringify(data.value));
        this.user = data.value;
        (document.getElementById("pfp")as HTMLImageElement).src = "data:image/jpeg;base64,"+ this.user.pfp;
      }
      else if(data.code == "ERRO"){
        console.log(data);
        
        this.router.navigateByUrl("/error")
      }

    });
  }


  NAME(){
    
    let name = (document.getElementById("profilename") as HTMLInputElement).value;
    let status = (document.getElementById("profilestatus") as HTMLInputElement).value;
    
    this.http.patch<Data>("/api/User/UpdateDetails/"+localStorage.getItem("SID")+'?name='+name+'&status='+status,null).subscribe(data=>{
      if(data.code == "DONE"){
        this.SetUserData()
      }
      else if(data.code == "ERRO"){
        this.router.navigateByUrl("/error")
      }      
    })
  }

  PW(){
    let oldp = (document.getElementById("profileoldPw") as HTMLInputElement).value;
    let newp = (document.getElementById("profilenewPw") as HTMLInputElement).value;

    console.log(this.cr.encrypt(this.cr.decrypt(this.user.encryptedKey,oldp),newp));
    

    this.http.patch<Data>("/api/User/UpdatePassword/"+localStorage.getItem("SID")+'?pw='+oldp+'&key='+this.cr.encrypt(this.cr.decrypt(this.user.encryptedKey,oldp),newp),new Data("DONE",newp)).subscribe(data=>{
      console.log(data);
      if(data.code == "DONE"){
        this.SetUserData()
      }
      else if(data.code == "ERRO"){
        this.router.navigateByUrl("/error")
      }

    })

  }


  PFP(e:any){
    let file : File= e.target.files[0];
    if (file) {      
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (evt) => {
        this.http.patch<Data>("/api/User/UpdatePFP/"+localStorage.getItem("SID"),new Data("DONE",evt.target?.result)).subscribe(data=>{
          if(data.code == "DONE"){
            this.SetUserData();
          }
          else if(data.code == "ERRO"){
            this.router.navigateByUrl("/error")
          }    
        })
      }
    }
  }
}
