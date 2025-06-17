import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../services/authentication/auth.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentAdminEmail: string = 'admin@example.com'; // Placeholder for logged-in admin's email

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    // Ensure dark mode is applied as default for consistency
    document.documentElement.setAttribute('data-bs-theme', 'dark');
    localStorage.setItem('theme', 'dark');

    // In a real application, you'd fetch the logged-in user's email
    // For now, it's a placeholder. You might get it from a token or a user service.
    // this.authService.getUserInfo().subscribe(info => {
    //   this.currentAdminEmail = info.email; // Assuming info has an email property
    // });
  }

  /**
   * Logs out the admin and redirects to the landing page.
   */
  logout(): void {
    this.authService.logout(); // Clear local storage (token)
    this.router.navigate(['/']); // Redirect to landing page
  }
}
