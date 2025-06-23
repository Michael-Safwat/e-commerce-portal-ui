import {Component} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {User} from "../../models/User";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  private userId: string = '';
  currentUser: User | null = null;
  userRoles: string[] = [];
  isSuperAdmin: boolean = false;
  isAdmin: boolean = false;

  constructor(private authService: AuthService,
              private router: Router,
              private userService: UserService) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserIdFromToken()!;
    this.getUserInfo();
    this.userRoles = this.authService.getUserRolesFromToken();
    console.log('User Roles:', this.userRoles);
    this.isSuperAdmin = this.authService.hasSuperAdminRole();
    this.isAdmin = this.authService.hasAdminRole();
  }

  getUserInfo(){
    this.userService.getUserById(this.userId).subscribe({
      next: (userData: User) => {
        this.currentUser = userData;
        console.log('User loaded:', this.currentUser);
      },
      error: (error) => {
        console.error('Error fetching user:', error);
        this.currentUser = null;
      },
      complete: () => {
        console.log('User fetching complete.');
      }
    });
  }

  logout(){
    this.authService.logout();
    // Remove Bootstrap modal/offcanvas scroll locks and backdrops
    document.body.classList.remove('modal-open', 'offcanvas-backdrop', 'offcanvas-active');
    document.body.style.overflow = '';
    const backdrops = document.querySelectorAll('.offcanvas-backdrop, .modal-backdrop');
    backdrops.forEach(bd => bd.remove());
    this.router.navigate(['/login'])
  }
}
