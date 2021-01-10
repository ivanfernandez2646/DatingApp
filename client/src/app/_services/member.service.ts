import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { Photo } from '../_models/Photo';
import { PaginationHeader } from '../_models/pagination';
import { UserParams } from '../_models/user-params';

@Injectable({
  providedIn: 'root'
})

export class MemberService {
  url = environment.apiRoute;
  members: Member[] = [];
  userParams: UserParams;

  constructor(private httpClient: HttpClient) { }

  getMembers(userParams: UserParams){
    let params = new HttpParams();
    
    if (userParams.pageNumber !== undefined && userParams.pageSize !== undefined){
      params = params.append('pageNumber', userParams.pageNumber.toString());
      params = params.append('pageSize', userParams.pageSize.toString());
    }

    params = params.append('currentUsername', userParams.currentUsername.toString());
    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());

    if (userParams.gender != "both")
      params = params.append('gender', userParams.gender.toString());

    return this.httpClient.get<Member[]>(this.url + "users", { params: params, observe: 'response' }).pipe(
      map(res => {
        let pagination: PaginationHeader = JSON.parse(res.headers.get("X-Pagination"));
        let response = {
          body: res.body,
          pagination: pagination
        }
        this.members = res.body;
        console.log(res.body);
        return response;
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
