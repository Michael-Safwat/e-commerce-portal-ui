import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../services/authentication/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent{
    successMessage: string = ''; // Property to hold success message
    errorMessage: string = '';   // Property to hold error message
    isLoading: boolean = false;  // Property to manage loading state

    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
    })

    constructor(private fb: FormBuilder,
                private authService: AuthService,
                private router: Router,
                private route: ActivatedRoute,) {
    }


    get email() {
        return this.loginForm.controls['email'];
    }

    get password() {
        return this.loginForm.controls['password'];
    }

    loginUser() {
        this.successMessage = '';
        this.errorMessage = '';
        this.isLoading = true;

        this.loginForm.markAllAsTouched();

        if (this.loginForm.valid) {
            const email = this.loginForm.value.email!;
            const password = this.loginForm.value.password!

            this.authService.login(email, password).subscribe({
                next: (res) => {
                    this.isLoading = false; // Clear loading state
                    localStorage.setItem('token', res.token);
                    this.successMessage = 'Login successful! Redirecting to profile...';
                    // In a real application, you might want a small delay before redirecting
                    setTimeout(() => {
                        this.router.navigate(['dashboard']);
                    }, 1000); // Redirect after 1 second for message visibility
                },
                error: (error: HttpErrorResponse) => { // Type the error as HttpErrorResponse
                    this.isLoading = false; // Clear loading state
                    console.error('Login error:', error);
                    if (error.status === 401 || error.status === 400) {
                        // Specific message for authentication failures
                        this.errorMessage = 'Invalid email or password. Please try again.';
                    } else {
                        // General error message for other issues
                        this.errorMessage = 'An unexpected error occurred. Please try again later.';
                    }
                }
            });
        } else {
            this.isLoading = false; // Clear loading state if form is invalid
            this.errorMessage = 'Please correct the errors in the form before submitting.';
            console.log('Form is invalid:', this.loginForm.errors);
        }
    }

    goToLandingPage(): void {
        this.router.navigate(['/']);
    }
}
