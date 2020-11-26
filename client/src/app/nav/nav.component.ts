import { Component, OnInit } from '@angular/core';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  isLogged: boolean;
  userLogged: any;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.getCurrentUser();
  }

  login(){
    this.accountService.login(this.model).subscribe((res => {
      this.isLogged = true;
      console.log(res);
    }), err => {
      console.log(err);
    });
  }

  logout(){
    this.isLogged = false;
    this.accountService.logout();
  }

  getCurrentUser(){
    this.accountService.currentUser$.subscribe((user) => {
      this.isLogged = !!user;
      if(user) this.userLogged = user;
    });
  }
}
