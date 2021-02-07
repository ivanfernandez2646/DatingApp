import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { RegisterUser } from '../_models/register-user';
import { User } from '../_models/user';
import { PresenceHubService } from './presence-hub.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  url = environment.apiRoute;
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private httpClient: HttpClient, 
    private presenceService: PresenceHubService) { }

  login(model: User){
    return this.httpClient.post(this.url + "account/login", model).pipe(
      map((response: User) => {
        const user = response;
        if(user){
          this.setCurrentUser(user);
        }
      })
    );
  }

  registerUser(registerUser: RegisterUser){
    return this.httpClient.post(this.url + "account/register", registerUser).pipe(
      map((response: User) => {
        const user = response;
        if(user){
          this.setCurrentUser(user);
        }
      })
    );
  }
  
  setCurrentUser(user: User){
    user.role = JSON.parse(atob(user.token.split(".")[1])).role;
    localStorage.setItem("user", JSON.stringify(user));
    this.currentUserSource.next(user);
    this.presenceService.onCreateHubConnection(user);
  }

  logout(){
    localStorage.removeItem("user");
    this.currentUserSource.next(null);
    this.presenceService.onStopHubConnection();
  }
}
