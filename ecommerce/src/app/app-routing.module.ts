import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/authentication/login/login.component';
import { RegisterComponent } from './components/authentication/register/register.component';
import { HomeComponent } from './components/landing/home/home.component';
import { AdminGuard } from './core/guards/auth.guard';


const routes: Routes = [
  { path: 'home', component: HomeComponent },  
  { path: '', redirectTo: '/home', pathMatch: 'full' },  
  { path: 'login', component: LoginComponent }, 
  { path: 'register', component: RegisterComponent }, 
  { path: 'register/admin', component: RegisterComponent },
  {
    path: 'admin',
    loadChildren: () => import('./components/authentication/auth.module').then(m => m.AuthModule),
    canLoad: [AdminGuard]
  }
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  
  exports: [RouterModule]
})
export class AppRoutingModule { }
