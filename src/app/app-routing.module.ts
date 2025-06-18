import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {authGuard} from "./guards/auth.guard";
import {AdminManagementComponent} from "./components/admin-management/admin-management.component";
import {ProductManagementComponent} from "./components/product-management/product-management.component";

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'productManagement', pathMatch: 'full' },
      { path: 'adminManagement', component: AdminManagementComponent },
      { path: 'productManagement', component: ProductManagementComponent }
    ]
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
