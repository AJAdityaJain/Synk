import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: WebSocket | undefined;

  public connect(): Observable<any> {
    if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
      this.socket = new WebSocket('ws://127.0.0.1/');//wss://socketsbay.com/wss/v2/1/demo/');
    }
    
    return new Observable(observer => {
      this.socket!.onopen = (event) =>{
        this.sendMessage("$$"+localStorage.getItem("SID"))
      }
      this.socket!.onmessage = (event) => {    
        observer.next(event.data);
      };

      this.socket!.onerror = (event) => {
        observer.error(event);
      };

      this.socket!.onclose = () => {
        observer.complete();
      };
    });
  }

  public sendMessage(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }
}
