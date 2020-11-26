import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RegisterUser } from '../_models/register-user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Input() usersFromHomeComponent: any;
  @Output() closeRegisterEvent = new EventEmitter();
  userToRegisterForm: any = {};

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
  }

  registerUser(){
    if(this.isValidPassword()){
      const userToRegister: RegisterUser = 
      {
        username:this.userToRegisterForm.username, 
        password:this.userToRegisterForm.password
      };

      this.accountService.registerUser(userToRegister).subscribe((res) => {
        this.cancel();
      }, error => {
        console.log(error);
      });
    } 
  }

  cancel(){
    this.closeRegisterEvent.emit(false);
  }

  private isValidPassword(){
    return this.userToRegisterForm.password.trim() == this.userToRegisterForm.repeatPassword.trim();
  }
}
