import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  url = environment.apiRoute;

  constructor(private httpClient: HttpClient) { }

  getUserWithRoles(){
    return this.httpClient.get<User[]>(this.url + "admin/users-with-roles");
  }

  editRoles(userRole: Partial<User>){
    let params = new HttpParams();
    params = params.append('roles', userRole.role?.join(","));
    return this.httpClient.put<string[]>(this.url + "admin/edit-roles/" + userRole.userName, {}, {params: params});
  }
}
