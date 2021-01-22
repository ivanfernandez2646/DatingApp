import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CreateMessage } from '../_models/create-message';
import { Message } from '../_models/message';
import { MessageParams } from '../_models/message-params';
import { PaginatedResult, PaginationHeader } from '../_models/pagination';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  url = environment.apiRoute;

  constructor(private httpClient: HttpClient) { }

  getMessages(messageParams: MessageParams){
    let params = getPaginationHeaders(messageParams);
    params = params.append('container', messageParams.container);
    return getPaginatedResult<Message[]>(this.url + "messages", this.httpClient, params);
  }

  getMessageThread(recipientUsername: string){
    return this.httpClient.get<Message[]>(this.url + "messages/thread/" + recipientUsername);
  }

  sendMessage(createMessage: CreateMessage){
    return this.httpClient.post<Message>(this.url + "messages", createMessage);
  }
  
  deleteMessage(messageParams: MessageParams){
    let params = getPaginationHeaders(messageParams);
    params = params.append('container', messageParams.container);
    params = params.append('messageId', messageParams.messageId);
    return this.httpClient.delete<Message[]>(this.url + "messages", { params: params, observe: 'response' }).pipe(
      map(res => {
        let pagination: PaginationHeader = JSON.parse(res.headers.get("X-Pagination"));
        const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();
        paginatedResult.body = res.body;
        paginatedResult.pagination = pagination;
        return paginatedResult;
      })
    );
  }
}
