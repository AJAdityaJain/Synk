import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Data } from 'src/models/Data';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  constructor(private http:HttpClient,  private router:Router ){}
  ngOnInit(){
    let redirect = "/signup"
    let sid = localStorage.getItem("SID");
    if(sid != null){
      this.http.get<Data>('http://localhost:4200/api/User/AutoLoginUser/'+sid)
      .subscribe(data => {
        if(data.code == "DONE"){
          redirect = "/main";
        }
      }) 
    }
    
    setTimeout(() => {
      this.router.navigateByUrl(redirect);
    }, 2000);
  }}
