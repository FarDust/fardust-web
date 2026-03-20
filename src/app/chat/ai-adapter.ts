import { Injectable } from '@angular/core';
import { ChatAdapter, Message, IChatParticipant, ParticipantResponse, User } from 'ng-chat';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface ChatResponse { response: string; }

@Injectable()
export class AiAdapter extends ChatAdapter {
  private ai: IChatParticipant = {
    participantType: 0,
    id: 1,
    displayName: 'AI'
  } as User;

  constructor(private http: HttpClient) {
    super();
  }

  listFriends(): Observable<ParticipantResponse[]> {
    return of([{ participant: this.ai, metadata: { totalUnreadMessages: 0 } }]);
  }

  getMessageHistory(_destinataryId: any): Observable<Message[]> {
    return of([]);
  }

  sendMessage(message: Message): void {
    this.http
      .post<ChatResponse>(environment.chatApiUrl, { prompt: message.message })
      .pipe(map(res => res.response))
      .subscribe(text => {
        const reply: Message = {
          fromId: this.ai.id,
          toId: message.fromId,
          message: text
        };
        this.onMessageReceived(this.ai, reply);
      });
  }
}
