import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BloggerComponent } from './blogger/blogger.component';
import { BlogComponent } from './blog/blog.component';
import { VisitorComponent } from './visitor/visitor.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import {FormsModule} from "@angular/forms";
import {RouterLink, RouterModule, RouterOutlet, Routes} from "@angular/router";
import {httpInterceptorProviders} from "./auth/auth-interceptor";
import {HttpClientModule} from "@angular/common/http";
import {RoleGuard} from "./guard/role.guard";
import { LogoutComponent } from './logout/logout.component';
import {AuthGuard} from "./guard/auth.guard";
import { ProfileComponent } from './profile/profile.component';
import { LikedBlogsComponent } from './liked-blogs/liked-blogs.component';
import { BlogPostComponent } from './blog-post/blog-post.component';
import { BlogPageComponent } from './blog-page/blog-page.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'blogger', component: BloggerComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_BLOGGER', 'ROLE_ADMIN'] },},
  { path: 'blog', component: BlogComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_BLOGGER', 'ROLE_ADMIN'] },},
  { path: 'visitor', component: VisitorComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_VISITOR', 'ROLE_ADMIN'] }, },
  { path: 'admin', component: AdminComponent },
  { path: 'liked-blogs', component: LikedBlogsComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_VISITOR', 'ROLE_BLOGGER', 'ROLE_ADMIN'] }, },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_BLOGGER', 'ROLE_ADMIN', 'ROLE_VISITOR'] },},
  { path: 'auth/login', component: LoginComponent },
  { path: 'blog-page', component: BlogPageComponent},
  { path: 'signup', component: RegisterComponent },
  { path: 'blog-page/:id', component: BlogPageComponent },
  { path: 'logout', component: LogoutComponent},
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    BloggerComponent,
    BlogComponent,
    VisitorComponent,
    AdminComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    LogoutComponent,
    ProfileComponent,
    LikedBlogsComponent,
    BlogPostComponent,
    BlogPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterLink,
    HttpClientModule,
    RouterModule.forRoot(routes),
    RouterOutlet,
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule { }
