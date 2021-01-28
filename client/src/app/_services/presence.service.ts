import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  url = environment.hubRoute;

  private hubConnection: HubConnection
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();

  constructor(private toastr: ToastrService) { }

  onCreateHubConnection(user: User){
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.url + "presence/", {accessTokenFactory: () => { return user.token }})
      .withAutomaticReconnect()
      .build();
    
    this.hubConnection
      .start()
      .catch(err => console.log(err));

    this.hubConnection
      .on("UserIsLogged", (res) => {
        this.toastr.success(res + " is connected");
      });

    this.hubConnection
      .on("UserIsLogout", (res) => {
        this.toastr.error(res + " is disconnected");
      });
    
    this.hubConnection
      .on("GetOnlineUsers", (res) => {
        this.onlineUsersSource.next([...res]);
      });
  }

  onStopHubConnection(){
    this.hubConnection
      .stop()
      .catch(err => console.log(err));
  }
}
