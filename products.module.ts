import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailsComponent } from './product-details.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ProductDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class ProductsModule { }
