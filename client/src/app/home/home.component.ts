import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RegisterUser } from '../_models/register-user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode: boolean = false;
  users: any;

  constructor(private httpClient: HttpClient,private accountService: AccountService) { }

  ngOnInit(): void {
  }

  toggleRegisterMode(){
    this.registerMode = !this.registerMode;
  }

  closeRegisterForm(event: boolean){
    this.registerMode = event;
  }
}
