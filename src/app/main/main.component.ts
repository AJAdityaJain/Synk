import { Cryptography } from './../../services/crypto.services';
import { User } from './../../models/User';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Data } from './../../models/Data';
import { WebsocketService } from 'src/services/websocket.service';
import { KeyHolderService } from 'src/services/key-holder.service';
import { Message } from 'src/models/Message';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  users:User[] = [];
  msgs:Message[]=[];

  uid:string = "";

  constructor(private http:HttpClient,private websocketService: WebsocketService, private cr:Cryptography) {
    
    this.websocketService.connect().subscribe(
      (message) => {
        message = JSON.parse(message);
        console.log(message);
        
        if(message.Code == "MSG"){
          if(this.uid == message.Value.cuid || message.Value.isSender){
            this.msgs.push(this.ParseMessage(message.Value));
            this.AutoScroll();  
            if(!message.Value.isSender)
              this.websocketService.sendMessage(new Data("READ",this.uid))
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
        console.log("Error Websocket Not Connected");
        console.error(error);
     }
    );
  }

  ngOnInit(){
    this.http.get<Data>("http://localhost:4200/api/Message/GetPrivateChats?sid="+localStorage.getItem("SID")).subscribe(data=>{
      this.users = data.value;
      this.users.forEach(e=>{
        KeyHolderService.AddKey(e.uid,e.publicKey);
      })
    })
  }

  Chat(uid:any){
    let m = new Message()
    this.uid = uid;
    this.http.get<Data>("http://localhost:4200/api/Message/GetPrivate?sid="+localStorage.getItem("SID")+"&uid="+uid).subscribe(data => {
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

  ParseMessage(msg:Message){
    msg.created = new Date(Date.parse(msg.created.toString()));
    msg.createdS =  this.formatAMPM(msg.created);//msg.created.getHours() + ":" +  msg.created.getMinutes();
    msg.message = this.cr.decrypt(msg.message,KeyHolderService.GetKey(msg.cuid).shared.toString())
    return msg
  }
  
  SendMsg(event:any){
    let d =  new Data(
    "DONE",
    this.cr.encrypt(event,KeyHolderService.GetKey(this.uid).shared.toString()));
    (document.getElementById("move")?.children[0] as HTMLInputElement).value = "";
    this.http.post<Data>("http://localhost:4200/api/Message/SendPrivate?sid="+localStorage.getItem("SID")+"&uid="+this.uid,d).subscribe(data=>{
      // if(data.code == "DONE"){}
    });
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
  
}
