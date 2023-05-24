import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-emoji-menu',
  templateUrl: './emoji-menu.component.html',
  styleUrls: ['./emoji-menu.component.scss']
})
export class EmojiMenuComponent {
  private emoji = require('emoji.json');

  @Output() onEmoji = new EventEmitter<string>();
  @Input() Show = "r";


  load(str:string){
    var a = document.getElementsByClassName("emojis")[0] as HTMLDivElement;
    a.innerHTML = "";
    var b = false;
    for (let i = 0; i < this.emoji.length; i++) {
      const e = this.emoji[i];
      if(!e.codes.includes("1F3F")){
        if(e.group == str){
          b = true;
          a.innerHTML+="<span>"+e.char+"</span>";
        }
        else{
          if(b==true){
            i = this.emoji.length;
          }
        }
      }
    }
  }

  click(event:any){
    if(event.target instanceof HTMLSpanElement)
    this.onEmoji.next(event.target.innerHTML);
  }
}
