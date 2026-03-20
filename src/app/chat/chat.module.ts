import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { NgChatModule } from 'ng-chat';
import { HttpClientModule } from '@angular/common/http';
import { AiAdapter } from './ai-adapter';

@NgModule({
  declarations: [ChatComponent],
  imports: [CommonModule, FormsModule, HttpClientModule, NgChatModule, ChatRoutingModule],
  providers: [AiAdapter]
})
export class ChatModule {}
