import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};

  constructor(public accountService: AccountService, private route: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  login(){
    this.accountService.login(this.model).subscribe((res => {
      this.route.navigateByUrl("/members");
      this.toastr.success("Login successful");
      console.log(res);
    }), err => {
      this.toastr.error(err.error);
      console.log(err);
    });
  }

  logout(){
    this.accountService.logout();
    this.route.navigateByUrl("/");
  }
}
