import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { RegisterUser } from '../_models/register-user';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  url = "https://localhost:5001/api/";
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private httpClient: HttpClient) { }

  login(model: User){
    return this.httpClient.post(this.url + "account/login", model).pipe(
      map((response: User) => {
        const user = response;
        if(user){
          localStorage.setItem("user", JSON.stringify(user));
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
          localStorage.setItem("user", JSON.stringify(user));
          this.setCurrentUser(user);
        }
      })
    );
  }
  setCurrentUser(user: User){
    this.currentUserSource.next(user);
  }

  logout(){
    localStorage.removeItem("user");
    this.currentUserSource.next(null);
  }
}
