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
    fetch('https://corporatebs-generator.sameerkumar.website/').then(function (response) {
      // The API call was successful!
      return response.json();
    }).then(function (data) {
      (document.getElementById("phrase") as HTMLSpanElement).innerText =  (data.phrase);
    }).catch(function (err) {
      console.warn('Something went wrong.', err);
    });
    let redirect = "/signup"
    let sid = localStorage.getItem("SID");
    if(sid != null){
      this.http.get<Data>('/api/User/AutoLoginUser/'+sid)
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
