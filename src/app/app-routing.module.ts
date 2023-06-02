import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component';
import { MainComponent } from './main/main.component';
import { LoaderComponent } from './loader/loader.component';
import { ErrorComponent } from './error/error.component';

const routes: Routes = [
  { path: '',redirectTo:'loader',pathMatch:'full'},//signup
  { path: 'signup', component: LogInComponent },
  { path: 'main', component: MainComponent },
  { path: 'loader', component: LoaderComponent },
  { path: 'error', component: ErrorComponent },
  { path: '**', component: LoaderComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }