import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';

const routes: Routes = [
  {
    path: 'dashboard',
    component: AdminDashboardComponent
  }
];
@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    AdminDashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), 
    RouterModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatButtonModule,
    NgbCarouselModule,
    MatCardModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCheckboxModule,
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
    AdminDashboardComponent
  ]
})
export class AuthModule { }
