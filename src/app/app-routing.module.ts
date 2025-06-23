import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {authGuard} from "./guards/auth.guard";
import {AdminManagementComponent} from "./components/admin-management/admin-management.component";
import {ProductManagementComponent} from "./components/product-management/product-management.component";
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SuperAdminGuard } from './guards/super-admin.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
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
      { path: 'adminManagement', component: AdminManagementComponent, canActivate: [SuperAdminGuard] },
      { path: 'productManagement', component: ProductManagementComponent, canActivate: [AdminGuard] }
    ]
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
