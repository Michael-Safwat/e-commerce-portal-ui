import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {passwordMatchValidator} from "../../shared/password-match.directive";
import {AuthService} from "../../services/authentication/auth.service";
import {Router} from "@angular/router";
import {User} from "../../models/User";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^[a-z ,.'-]+$/i)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  }, {
    validators: passwordMatchValidator
  })

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router) {
  }

  get name(){
    return this.registerForm.controls['name'];
  }

  get email() {
    return this.registerForm.controls['email'];
  }

  get password() {
    return this.registerForm.controls['password'];
  }

  get confirmPassword() {
    return this.registerForm.controls['confirmPassword'];
  }

  registerUser() {
    const postData = {...this.registerForm.value};
    delete postData.confirmPassword;

    this.authService.registerUser(postData as User).subscribe((res: any) => {
        console.log(res);
        this.router.navigate(['login']);
      },
      () => {
      })
  }
}
