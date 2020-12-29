import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { Photo } from '../_models/Photo';

@Injectable({
  providedIn: 'root'
})

export class MemberService {
  url = environment.apiRoute;
  members: Member[] = [];

  constructor(private httpClient: HttpClient) { }

  getMembers(){
    if(this.members.length > 0) return of(this.members);
    return this.httpClient.get<Member[]>(this.url + "users").pipe(
      map(res => {
        this.members = res;
        return res;
      })
    );
  }

  getMember(username: string){
    const user = this.members.find(x => x.userName === username);
    if(user !== undefined)
      return of(user);
    return this.httpClient.get<Member>(this.url + "users/" + username);
  }

  updateMember(member: Member){
    return this.httpClient.put(this.url + "users", member);
  }

  setMainPhoto(photoId: number){
    return this.httpClient.put(this.url + "users/set-main-photo/" + photoId, {}).pipe(
      map((res: Photo) => {
        return res;
      })
    );
  }

  deletePhoto(photoId: number){
    return this.httpClient.delete(this.url + "users/delete-photo/" + photoId);
  }
}
