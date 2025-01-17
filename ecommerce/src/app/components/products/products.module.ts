import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailsComponent } from './product-details.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { ImageZoomDirective } from '../directives/image-zoom.directive';
import { HomeModule } from '../landing/home.module';

@NgModule({
  declarations: [
    ProductDetailsComponent,
    ImageZoomDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatExpansionModule,
    MatIconModule,
    HomeModule
  ]
})
export class ProductsModule { }
