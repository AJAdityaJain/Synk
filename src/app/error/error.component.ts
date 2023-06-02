import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {
  constructor(private router:Router){

  }

  redirect(){
    
    this.router.navigateByUrl("/loader")
  }
}
