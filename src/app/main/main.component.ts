import { Cryptography } from './../../services/crypto.services';
import { User } from './../../models/User';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Data } from './../../models/Data';
import { WebsocketService } from 'src/services/websocket.service';
import { KeyHolderService } from 'src/services/key-holder.service';
import { Message } from 'src/models/Message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  users:User[] = [];
  msgs:Message[]=[];

  uid:string = "";
  user:User = new User(); 


  constructor(private http:HttpClient,private websocketService: WebsocketService, private cr:Cryptography,private router:Router) {
  }    

  ngOnInit(){

    this.websocketService.connect().subscribe(
      (message) => {
        message = JSON.parse(message);
        if(message.Code == "MSG"){
          if(this.uid == message.Value.cuid || message.Value.isSender){          
            this.msgs.push(this.ParseMessage(message.Value,message.Value.isSender));
            this.AutoScroll();  
            if(!message.Value.isSender){
              this.websocketService.sendMessage(new Data("READ",this.uid))
            }
          }
        }
        else if(message.Code == "READ"){
          if(this.uid == message.Value){
            for (let i = 0; i < this.msgs.length; i++) {              
              this.msgs[i].isRead = true;
            }
          }
        }
      },
      (error) => {
        this.router.navigateByUrl("../");
        console.log("Error: Websocket Not Connected");
        console.error(error);
      }
    );

    this.http.get<Data>("/api/User/GetChatters/"+localStorage.getItem("SID")).subscribe(data=>{
      this.users = data.value;
      
      this.users.forEach(e=>{
        KeyHolderService.AddKey(e.uid,e.publicKey);
      })

      this.SetUserData()
    })
  }

  SetUserData(){
    this.http.get<Data>("/api/User/GetUserFromSession/"+localStorage.getItem("SID")).subscribe(data=>{
      console.log(data);
    });
  }

  PFP(e:any){
    let file : File= e.target.files[0];
    if (file) {      
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (evt) => {
        this.http.patch("/api/User/SetPFP/"+localStorage.getItem("SID"),new Data("DONE",evt.target?.result)).subscribe(e=>{
        })
      }
    }
  }

  Chat(uid:any){
    this.uid = uid;
    for (let i = 0; i < this.users.length; i++) {
      if(this.users[i].uid == uid){        
        this.user = this.users[i];
        break;
      }
    }
    this.http.get<Data>("/api/Message/GetPrivate/"+localStorage.getItem("SID")+"?uid="+uid).subscribe(data => {
      this.msgs = data.value;  
      let ps = "";
      let pt = "";
      for (let i = 0; i < this.msgs.length; i++) {
        this.msgs[i] = this.ParseMessage(this.msgs[i]);
        if(ps!= this.msgs[i].created.toDateString()){
          ps = this.msgs[i].created.toDateString();
          this.msgs[i].date = ps;
        }
        if(pt!=this.msgs[i].createdS+(this.msgs[i].isSender)){
          pt = this.msgs[i].createdS+(this.msgs[i].isSender)
        }
        else{
          this.msgs[i].createdS = "";
        }
      }
        this.AutoScroll()
    });
  }

  ParseMessage(msg:Message,u?:any){
    msg.created = new Date(Date.parse(msg.created.toString()));
    msg.createdS =  this.formatAMPM(msg.created);//msg.created.getHours() + ":" +  msg.created.getMinutes();
    let key = this.cr.getSecrecy(KeyHolderService.GetKey(u==true?msg.uid:msg.cuid).shared,msg.key)
    msg.message = this.cr.decrypt(msg.message,key.toString()).replaceAll("$<n>%", "\n");
    return msg
  }

  SendMsg(){    
    //KeyHolderService.GetKey(this.uid).shared.toString()
    let key = this.cr.applySecrecy(KeyHolderService.GetKey(this.uid).shared);    
    let inp = (document.getElementById("text") as HTMLTextAreaElement);
    if(inp.value.trim() != ""){
      
      let d =  new Data("DONE",this.cr.encrypt(inp.value.replaceAll("\n","$<n>%"), key[0].toString()));    
      inp.value = "";
      this.http.post<Data>("/api/Message/SendPrivate?sid="+localStorage.getItem("SID")+"&uid="+this.uid+"&key="+key[1],d).subscribe(data=>{
        // if(data.code == "DONE"){}
        
      });
    }
  }

  AutoScroll(){
    setTimeout(() => {
      try{
        let obj = document.getElementById("messages") as HTMLDivElement;
        obj.scrollTop = obj.scrollHeight;
      }
      catch(err){}
    },10)
  }
  
  formatAMPM(date:Date) :string{
    var hours = date.getHours();
    var minutes:string|number = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
  AddPerson(){
    let email = (document.getElementById("newEmail") as HTMLInputElement).value;
    this.users.forEach(el => {
      if(el.email == email){
        this.Chat(el.uid);
        return;
      }
    });

    
    this.http.get<Data>("/api/User/GetUser/"+email).subscribe(data=>{
      if(data.code == "DONE"){

        KeyHolderService.AddKey(data.value.uid,data.value.publicKey);
        
        this.users.push(data.value);
        this.Chat(data.value.uid)
      }
    })
  }    
}
