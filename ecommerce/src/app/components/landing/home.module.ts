import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button'; 
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header/header.component';
import { CarouselComponent } from './carousel/carousel/carousel.component';
import { PremiumBoutiquesComponent } from './premium-boutiques/premium-boutiques/premium-boutiques.component';
import { LoginComponent } from '../authentication/login/login.component';
import { RegisterComponent } from '../authentication/register/register.component';
import { AccountDialogComponent } from './account-dialog/account-dialog.component';
import { AppComponent } from '../../app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    CarouselComponent,
    PremiumBoutiquesComponent,
    AccountDialogComponent,
    NavMenuComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    MatIconModule,     
    MatMenuModule,     
    MatBadgeModule,    
    MatButtonModule,
    NgbCarouselModule,
    MatCardModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class HomeModule { }
