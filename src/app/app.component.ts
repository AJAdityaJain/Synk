import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  ngOnInit(){
    localStorage.setItem("g","19");
    localStorage.setItem("p","4692757");
  }
}
