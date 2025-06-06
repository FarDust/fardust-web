import { Component } from '@angular/core';
import { AiAdapter } from './ai-adapter';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.sass']
})
export class ChatComponent {
  userId = 0;
  constructor(public adapter: AiAdapter) {}
}
