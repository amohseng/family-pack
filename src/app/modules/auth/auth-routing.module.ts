import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { VerifyComponent } from './verify/verify.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { ViewGroupComponent } from './view-group/view-group.component';
import { JoinGroupComponent } from './join-group/join-group.component';

import { AuthGuard } from 'src/app/services/auth.guard';
import { AnonymousGuard } from 'src/app/services/anonymous.guard';


const routes: Routes = [
  {path: 'login', component: LoginComponent, canActivate: [AnonymousGuard]},
  {path: 'signup', component: SignupComponent, canActivate: [AnonymousGuard]},
  {path: 'verify', component: VerifyComponent, canActivate: [AnonymousGuard]},
  {path: 'changepassword', component: ChangePasswordComponent, canActivate: [AuthGuard]},
  {path: 'updateprofile', component: UpdateProfileComponent, canActivate: [AuthGuard]},
  {path: 'viewgroup', component: ViewGroupComponent, canActivate: [AuthGuard]},
  {path: 'joingroup', component: JoinGroupComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
