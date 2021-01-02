import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
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
  maxDate: Date;

  constructor(private accountService: AccountService, private toastr: ToastrService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear()-18);
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, {validator: this.passwordCorrectFromConfirmPasswordField});
  }

  passwordCorrectFromConfirmPasswordField: ValidatorFn = (fg: FormGroup) => {
    if(fg.get("password").value == fg.get("confirmPassword").value)
      return null;
    
    fg.get("confirmPassword").setErrors({ matchPassword: true });
    return;
  }

  registerUser() {
    // const userToRegister: RegisterUser = 
    // {
    //   userName:this.userToRegisterForm.username, 
    //   password:this.userToRegisterForm.password
    // };
    // const userToRegister: RegisterUser = 
    // {
    //   userName:this.registerForm.get("username").value, 
    //   password:this.registerForm.get("password").value
    // };

    this.accountService.registerUser(this.registerForm.value).subscribe((res) => {
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
