import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent {
  @Input() Name:string="";
  @Input() Status:string="";
  @Input() PFP:string = "";

  @Input() Src:string = "";

  id:string = Math.random().toString();


  ngOnChanges(){
    setTimeout(() => {
    
      var img = (document.getElementById(this.id) as HTMLImageElement)
      img.style.content = "";
  
      if(this.Src==""){
        if(this.PFP==""){        
          img.style.setProperty("-webkit-mask-image","url(../../assets/User.png)");
            
        }
        else{
          img.style.setProperty("-webkit-mask-image","");
          img.style.content = 'none';
          img.src = "data:image/jpg;base64,"+  this.PFP;
        }
      }
      else{
        img.style.borderRadius = "0";
        img.parentElement!.style.background = "none";
        img.style.setProperty("-webkit-mask-image","url(../../assets/icon.png)");
      }
        
    }, 0);
  }
}