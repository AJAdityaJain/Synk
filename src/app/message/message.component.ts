import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  @Input() text:string = "";
  @Input() from:string = "";
  @Input() time:string = "";
  @Input() self:string = "";
  @Input() read:string = "";
  @Input() date:string = "";
  Self = false;
  ngOnInit(){   
    this.Self = this.self=="true";
  }
}
