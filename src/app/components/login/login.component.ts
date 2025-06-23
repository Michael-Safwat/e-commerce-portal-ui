import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent{
    isLoading: boolean = false;

    // Toast state
    toasts: { header: string, message: string, type: 'success' | 'error', delay?: number }[] = [];
    private toastTimeout: any = null;

    showToast(header: string, message: string, type: 'success' | 'error', delay: number = 3000) {
        this.toasts = [];
        if (this.toastTimeout) {
            clearTimeout(this.toastTimeout);
            this.toastTimeout = null;
        }
        this.toasts.push({ header, message, type, delay });
        this.toastTimeout = setTimeout(() => {
            this.toasts.shift();
            this.toastTimeout = null;
        }, delay);
    }

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
        this.isLoading = true;
        this.loginForm.markAllAsTouched();
        if (this.loginForm.valid) {
            const email = this.loginForm.value.email!;
            const password = this.loginForm.value.password!
            this.authService.login(email, password).subscribe({
                next: (res) => {
                    this.isLoading = false;
                    localStorage.setItem('token', res.token);
                    
                    // Check if user has valid admin role
                    if (this.authService.hasValidAdminRole()) {
                        this.showToast('Success', 'Login successful! Redirecting to dashboard...', 'success');
                        // Remove Bootstrap modal/offcanvas scroll locks and backdrops
                        document.body.classList.remove('modal-open', 'offcanvas-backdrop', 'offcanvas-active');
                        document.body.style.overflow = '';
                        const backdrops = document.querySelectorAll('.offcanvas-backdrop, .modal-backdrop');
                        backdrops.forEach(bd => bd.remove());
                        setTimeout(() => {
                            this.router.navigate(['dashboard']);
                        }, 1000);
                    } else {
                        // User doesn't have admin role, logout and show error
                        this.authService.logout();
                        this.showToast('Access Denied', 'You do not have permission to access this system. Please contact your administrator.', 'error');
                    }
                },
                error: (error: HttpErrorResponse) => {
                    this.isLoading = false;
                    if (error.status === 401 || error.status === 400) {
                        this.showToast('Error', 'Invalid email or password. Please try again.', 'error');
                    } else {
                        this.showToast('Error', 'An unexpected error occurred. Please try again later.', 'error');
                    }
                }
            });
        } else {
            this.isLoading = false;
            this.showToast('Error', 'Please correct the errors in the form before submitting.', 'error');
        }
    }

    goToLandingPage(): void {
        this.router.navigate(['/']);
    }
}
