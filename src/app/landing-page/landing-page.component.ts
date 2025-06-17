import { Component, OnInit } from '@angular/core'; // Import OnInit for lifecycle hook
import { Router } from '@angular/router'; // Import Router for navigation

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Force dark mode: always set 'data-bs-theme' to 'dark'
    document.documentElement.setAttribute('data-bs-theme', 'dark');
    localStorage.setItem('theme', 'dark'); // Persist the dark mode preference
  }

  /**
   * Navigates the user to the login page when the login button is clicked.
   * Assumes a '/login' route exists in your Angular application.
   */
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
