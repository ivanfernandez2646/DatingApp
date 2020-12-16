import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';

@Injectable({
  providedIn: 'root'
})

export class MemberService {
  url = environment.apiRoute;

  constructor(private httpClient: HttpClient) { }

  getMembers(){
    return this.httpClient.get<Member[]>(this.url + "users");
  }

  getMember(username: string){
    return this.httpClient.get<Member>(this.url + "users/" + username);
  }

  updateMember(member: Member){
    return this.httpClient.put(this.url + "users", member);
  }
}
