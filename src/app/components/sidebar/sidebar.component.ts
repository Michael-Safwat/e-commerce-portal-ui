import {Component} from '@angular/core';
import {AuthService} from "../../services/authentication/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  constructor(private authService: AuthService,
              private router: Router) { }


  logout(){
    this.authService.logout();
    this.router.navigate(['/'])
  }

  openProfile() {
    this.router.navigate(['/profile'])
  }

  manageAdmins() {
    this.router.navigate(['/adminsManagement'])
  }

  manageProducts() {
    this.router.navigate(['/productsManagement'])
  }
}
