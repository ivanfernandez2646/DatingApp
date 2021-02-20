import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Message } from '../_models/message';
import { User } from '../_models/user';
import { AccountService } from './account.service';
import { BusyService } from './busy.service';

@Injectable({
  providedIn: 'root'
})
export class MessageHubService {
  url = environment.hubRoute;
  user: User;

  public hubConnection: HubConnection;
  private messageSource = new BehaviorSubject<Message[]>([]);
  message$ = this.messageSource.asObservable();

  constructor(private accountService: AccountService,
    private busyService: BusyService) {
  }

  onCreateHubConnection(recipientUsername: string){
    this.busyService.showLoadingAnimation();
    this.getUser();
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.url + "message?user=" + recipientUsername, {accessTokenFactory: () => { return this.user.token }})
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .catch(err => console.log(err))
      .finally(() => this.busyService.hideLoadingAnimation());

    this.hubConnection
      .on("GetMessageThread", (res: Message[]) => {
        this.messageSource.next(res);
      });
    
    this.hubConnection
      .on("GetNewMessage", (res: Message) => {
        let currentMessages = this.messageSource.getValue();
        currentMessages.push(res);
        this.messageSource.next(currentMessages);
      });
  }

  onStopHubConnection(){
    this.hubConnection
      .stop()
      .catch(err => console.log(err))
      .finally(() => {
        this.messageSource.next([]);
        this.removeUser();
      });
  }

  private getUser = () => {
    this.accountService.currentUser$.pipe(take(1))
    .subscribe((res) => this.user = res);
  };

  private removeUser = () => {
    this.user = undefined;
  };
}
