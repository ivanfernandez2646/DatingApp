import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { Photo } from '../_models/Photo';
import { PaginatedResult, PaginationHeader } from '../_models/pagination';
import { UserParams } from '../_models/user-params';
import { AccountService } from './account.service';
import { User } from '../_models/user';
import { LikeParams } from '../_models/like-params';
import { GenericParams } from '../_models/generic-params';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})

export class MemberService {
  url = environment.apiRoute;
  cachedResults = new Map<string, PaginatedResult<Member[]>>();
  userParams: UserParams;
  user: User;

  constructor(private httpClient: HttpClient, private accountService: AccountService) {
    accountService.currentUser$.pipe(take(1)).subscribe(res => this.user = res);
    this.userParams = new UserParams(this.user);
  }
  
  getMembers(userParams: UserParams){
    let filterKey = Object.values(userParams).join("-");
    if(this.cachedResults.has(filterKey)){
      return of(this.cachedResults.get(filterKey));  
    }
    
    let params = getPaginationHeaders(userParams);
    params = this.getMembersHeaders(params, userParams);

    return getPaginatedResult<Member[]>(this.url + "users", this.httpClient, params).pipe(
      map(paginatedResult => {
        this.cachedResults.set(filterKey, paginatedResult);
        return paginatedResult;
      })
    );
  }

  getMember(username: string){
    const cachedResultFlat = [...this.cachedResults.values()]
      .flat()
      .reduce((prev, curr) => curr.body, []);

    const foundedMember = cachedResultFlat.find((m: Member) => m.userName == username);
    if(foundedMember)
      return of(foundedMember);

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

  addLike(username: string){
    return this.httpClient.post(this.url + "likes/" + username, {});
  }

  getUserLikes(likeParams: LikeParams){
    let params = getPaginationHeaders(likeParams);
    params = params.append('predicate', likeParams.predicate);
    return getPaginatedResult<Partial<Member[]>>(this.url + "likes", this.httpClient, params);
  }

  private getMembersHeaders(params: HttpParams, userParams: UserParams): HttpParams{
    params = params.append('currentUsername', userParams.currentUsername.toString());
    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('orderBy', userParams.orderBy.toString());

    if (userParams.gender != "both")
      params = params.append('gender', userParams.gender.toString());

    return params; 
  }

  //Properties getters and setters
  setUserParams(userParams: UserParams){
    this.userParams = userParams;
  }

  getUserParams(): UserParams{
    return this.userParams;
  }

  resetUserParams(){
    this.userParams = new UserParams(this.user);
  }
}
