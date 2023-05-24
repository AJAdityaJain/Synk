import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-text-box',
  templateUrl: './text-box.component.html',
  styleUrls: ['./text-box.component.scss']
})
export class TextBoxComponent {
  @Output() OnSend  = new EventEmitter<string>()

  EmojiMenu = false;

  Message(){
    this.OnSend.next((document.getElementById("text") as HTMLInputElement).value);
  }

  Emoji(e:any){
    var inp =  (document.getElementById("text") as HTMLInputElement);
    inp.value += e
  }
}
