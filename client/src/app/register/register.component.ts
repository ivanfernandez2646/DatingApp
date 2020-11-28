import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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

  constructor(private accountService: AccountService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  registerUser(){
    if(this.isValidPassword()){
      const userToRegister: RegisterUser = 
      {
        userName:this.userToRegisterForm.username, 
        password:this.userToRegisterForm.password
      };

      this.accountService.registerUser(userToRegister).subscribe((res) => {
        this.toastr.success("Register successful");
        this.cancel();
      }, error => {
        this.toastr.error(error.error);
        console.log(error);
      });
    }else{
      this.toastr.error("Passwords don't match");
    }
  }

  cancel(){
    this.closeRegisterEvent.emit(false);
  }

  private isValidPassword(){
    return this.userToRegisterForm.password.trim() == this.userToRegisterForm.repeatPassword.trim();
  }
}
