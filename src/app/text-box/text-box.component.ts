import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-text-box',
  templateUrl: './text-box.component.html',
  styleUrls: ['./text-box.component.scss']
})
export class TextBoxComponent {
  @Output() OnSend  = new EventEmitter<string>()

  Message(){
    this.OnSend.next((document.getElementsByTagName("input")[0] as HTMLInputElement).value);
  }
}
