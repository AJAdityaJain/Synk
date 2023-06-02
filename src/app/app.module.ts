import { KeyHolderService } from './../services/key-holder.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MessageComponent } from './message/message.component';
import { TextBoxComponent } from './text-box/text-box.component';
import { LogInComponent } from './log-in/log-in.component';

import { HttpClientModule } from '@angular/common/http';
import { MainComponent } from './main/main.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { EmojiMenuComponent } from './emoji-menu/emoji-menu.component';
import { LoaderComponent } from './loader/loader.component';
import { ProfileComponent } from './profile/profile.component';
import { ErrorComponent } from './error/error.component';

@NgModule({
  declarations: [
    AppComponent,
    MessageComponent,
    TextBoxComponent,
    LogInComponent,
    MainComponent,
    ChatBoxComponent,
    EmojiMenuComponent,
    LoaderComponent,
    ProfileComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,  
  ],
  providers: [
    KeyHolderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
