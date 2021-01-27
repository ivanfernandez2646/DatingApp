import { Injectable, OnInit } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Injectable({
  providedIn: 'root'
})
export class PreventAccessAdminPanelGuard implements CanActivate {
  constructor(private accountService: AccountService,
    private toastr: ToastrService) {}

  canActivate(): boolean {
    let user: User;
    this.accountService.currentUser$.pipe(take(1)).subscribe(res => user = res);
    if(user.role?.includes("admin") || user.role?.includes("moderator")){
      return true;
    }

    this.toastr.error("You don't have grants to access this");
    return false;
  }
  
}
