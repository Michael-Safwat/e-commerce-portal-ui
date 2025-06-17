import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {MyProfileComponent} from "./components/my-profile/my-profile.component";
import {LandingPageComponent} from "./landing-page/landing-page.component";
import {DashboardComponent} from "./dashboard/dashboard.component";

const routes: Routes = [
  {
    path:'landing-page',
    component: LandingPageComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'my-profile',
    component: MyProfileComponent
  },
  {
    path: "dashboard",
    component: DashboardComponent
  },
  {
    path: '', redirectTo: 'landing-page', pathMatch: 'full'
  },
  {
    path: '**', redirectTo: 'landing-page', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
