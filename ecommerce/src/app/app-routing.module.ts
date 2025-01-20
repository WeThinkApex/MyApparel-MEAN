import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/authentication/login/login.component';
import { RegisterComponent } from './components/authentication/register/register.component';
import { HomeComponent } from './components/landing/home/home.component';
import { AdminGuard } from './core/guards/auth.guard';
import { ProductDetailsComponent } from './components/products/product-details.component';
// import { ProductDetailsComponent } from './components/products/product-details-component/product-details-component.component';


const routes: Routes = [
  { path: 'demo', component: HomeComponent },  
  { path: '', redirectTo: '/demo', pathMatch: 'full' },  
  { path: 'admin/login', component: LoginComponent }, 
  // <!-- In Future use -->
  // { path: 'register', component: RegisterComponent }, 
  // { path: 'register/admin', component: RegisterComponent },
  {
    path: 'admin',
    loadChildren: () => import('./components/authentication/auth.module').then(m => m.AuthModule),
    canLoad: [AdminGuard]
  },
  { path: 'product/:id', component: ProductDetailsComponent }
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  
  exports: [RouterModule]
})
export class AppRoutingModule { }
