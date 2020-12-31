import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
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
  //userToRegisterForm: any = {};

  registerForm: FormGroup;

  constructor(private accountService: AccountService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, this.arePasswordsTheSame])
    });
  }

  arePasswordsTheSame: ValidatorFn = (control: AbstractControl) => {
    if(control.value == control.parent?.controls['password']?.value)
      return null;

    return { matchError: true};
  }

  registerUser() {
    // const userToRegister: RegisterUser = 
    // {
    //   userName:this.userToRegisterForm.username, 
    //   password:this.userToRegisterForm.password
    // };

    const userToRegister: RegisterUser = 
    {
      userName:this.registerForm.get("username").value, 
      password:this.registerForm.get("password").value
    };

    this.accountService.registerUser(userToRegister).subscribe((res) => {
      this.toastr.success("Register successful");
      this.cancel();
    }, error => {
      this.toastr.error(error.error);
      console.log(error);
    });
  }

  cancel() {
    this.closeRegisterEvent.emit(false);
  }
}
